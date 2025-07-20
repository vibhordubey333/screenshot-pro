// Background service worker for Screenshot Pro
class ScreenshotManager {
    constructor() {
        this.setupMessageListeners();
        this.screenshotHistory = [];
    }

    setupMessageListeners() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'captureScreenshot') {
                this.handleScreenshotRequest(request, sendResponse);
                return true; // Keep message channel open for async response
            }
        });
    }

    async handleScreenshotRequest(request, sendResponse) {
        try {
            const { type, tabId, format, quality } = request;
            let dataUrl;

            switch (type) {
                case 'visible':
                    dataUrl = await this.captureVisibleArea(tabId, format, quality);
                    break;
                case 'fullpage':
                    dataUrl = await this.captureFullPage(tabId, format, quality);
                    break;
                case 'selection':
                    dataUrl = await this.captureSelection(tabId, format, quality);
                    break;
                default:
                    throw new Error('Invalid capture type');
            }

            // Save to history
            this.saveToHistory({
                url: request.url,
                timestamp: Date.now(),
                type: type,
                format: format
            });

            sendResponse({
                success: true,
                dataUrl: dataUrl
            });

        } catch (error) {
            console.error('Screenshot capture error:', error);
            sendResponse({
                success: false,
                error: error.message
            });
        }
    }

    async captureVisibleArea(tabId, format, quality) {
        try {
            // First try standard tab capture
            const dataUrl = await chrome.tabs.captureVisibleTab(null, {
                format: format,
                quality: quality
            });
            return dataUrl;
        } catch (error) {
            console.log('Standard capture failed, trying desktop capture:', error);
            // Fallback to desktop capture for DRM content
            return await this.captureWithDesktopAPI(tabId, format, quality);
        }
    }

    async captureFullPage(tabId, format, quality) {
        // Inject script to capture full page
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['injected.js']
        });

        // Send message to content script to capture full page
        const response = await chrome.tabs.sendMessage(tabId, {
            action: 'captureFullPage',
            format: format,
            quality: quality
        });

        if (response && response.success) {
            return response.dataUrl;
        } else {
            throw new Error('Failed to capture full page');
        }
    }

    async captureSelection(tabId, format, quality) {
        // Inject selection tool
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['injected.js']
        });

        // Send message to content script to start selection
        const response = await chrome.tabs.sendMessage(tabId, {
            action: 'startSelection',
            format: format,
            quality: quality
        });

        if (response && response.success) {
            return response.dataUrl;
        } else {
            throw new Error('Failed to capture selection');
        }
    }

    async captureWithDesktopAPI(tabId, format, quality) {
        return new Promise((resolve, reject) => {
            // Request desktop capture
            chrome.desktopCapture.chooseDesktopMedia(
                ['screen', 'window'],
                { tabId: tabId },
                (streamId) => {
                    if (!streamId) {
                        reject(new Error('No stream selected'));
                        return;
                    }

                    // Create video element to capture the stream
                    const video = document.createElement('video');
                    video.srcObject = streamId;
                    video.onloadedmetadata = () => {
                        video.play();
                        
                        // Create canvas to capture the video
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        
                        ctx.drawImage(video, 0, 0);
                        
                        // Convert to data URL
                        const dataUrl = canvas.toDataURL(`image/${format}`, quality);
                        
                        // Stop the stream
                        video.pause();
                        video.srcObject = null;
                        
                        resolve(dataUrl);
                    };
                    
                    video.onerror = () => {
                        reject(new Error('Failed to capture desktop stream'));
                    };
                }
            );
        });
    }

    saveToHistory(screenshot) {
        this.screenshotHistory.unshift(screenshot);
        
        // Keep only last 50 screenshots
        if (this.screenshotHistory.length > 50) {
            this.screenshotHistory = this.screenshotHistory.slice(0, 50);
        }

        // Save to storage
        chrome.storage.local.set({
            screenshotHistory: this.screenshotHistory
        });
    }

    async getHistory() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['screenshotHistory'], (result) => {
                resolve(result.screenshotHistory || []);
            });
        });
    }
}

// Initialize screenshot manager
const screenshotManager = new ScreenshotManager();

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        // Set default settings
        chrome.storage.sync.set({
            format: 'png',
            quality: 90,
            autoDownload: true,
            showNotifications: true
        });
    }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
    if (command === 'capture-visible') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                screenshotManager.handleScreenshotRequest({
                    action: 'captureScreenshot',
                    type: 'visible',
                    tabId: tabs[0].id,
                    format: 'png',
                    quality: 0.9
                }, (response) => {
                    if (response && response.success) {
                        // Auto-download
                        chrome.downloads.download({
                            url: response.dataUrl,
                            filename: `screenshot_${Date.now()}.png`,
                            saveAs: false
                        });
                    }
                });
            }
        });
    }
}); 