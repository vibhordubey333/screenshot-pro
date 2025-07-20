// Content script for Screenshot Pro
class ScreenshotContentScript {
    constructor() {
        this.isSelecting = false;
        this.selectionBox = null;
        this.startX = 0;
        this.startY = 0;
        this.setupMessageListeners();
    }

    setupMessageListeners() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.action) {
                case 'captureFullPage':
                    this.captureFullPage(request.format, request.quality)
                        .then(dataUrl => sendResponse({ success: true, dataUrl }))
                        .catch(error => sendResponse({ success: false, error: error.message }));
                    return true;

                case 'startSelection':
                    this.startSelection(request.format, request.quality)
                        .then(dataUrl => sendResponse({ success: true, dataUrl }))
                        .catch(error => sendResponse({ success: false, error: error.message }));
                    return true;

                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        });
    }

    async captureFullPage(format, quality) {
        return new Promise((resolve, reject) => {
            try {
                const body = document.body;
                const html = document.documentElement;
                
                // Get full page dimensions
                const height = Math.max(
                    body.scrollHeight,
                    body.offsetHeight,
                    html.clientHeight,
                    html.scrollHeight,
                    html.offsetHeight
                );
                
                const width = Math.max(
                    body.scrollWidth,
                    body.offsetWidth,
                    html.clientWidth,
                    html.scrollWidth,
                    html.offsetWidth
                );

                // Create canvas for full page
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = width;
                canvas.height = height;

                // Set background color
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);

                // Capture in chunks to handle large pages
                const chunkHeight = 1000;
                const chunks = Math.ceil(height / chunkHeight);
                let currentY = 0;

                const captureChunk = () => {
                    if (currentY >= height) {
                        // All chunks captured, return the result
                        const dataUrl = canvas.toDataURL(`image/${format}`, quality);
                        resolve(dataUrl);
                        return;
                    }

                    const chunkEndY = Math.min(currentY + chunkHeight, height);
                    
                    // Scroll to position
                    window.scrollTo(0, currentY);
                    
                    // Wait for scroll and repaint
                    setTimeout(() => {
                        // Capture visible area
                        html2canvas(document.body, {
                            width: width,
                            height: chunkEndY - currentY,
                            x: 0,
                            y: currentY,
                            scrollX: 0,
                            scrollY: 0,
                            useCORS: true,
                            allowTaint: true,
                            backgroundColor: '#ffffff'
                        }).then(chunkCanvas => {
                            // Draw chunk onto main canvas
                            ctx.drawImage(chunkCanvas, 0, currentY);
                            currentY = chunkEndY;
                            
                            // Capture next chunk
                            setTimeout(captureChunk, 100);
                        }).catch(reject);
                    }, 200);
                };

                // Start capturing chunks
                captureChunk();

            } catch (error) {
                reject(error);
            }
        });
    }

    async startSelection(format, quality) {
        return new Promise((resolve, reject) => {
            if (this.isSelecting) {
                reject(new Error('Selection already in progress'));
                return;
            }

            this.isSelecting = true;
            this.createSelectionOverlay();

            const handleMouseDown = (e) => {
                this.startX = e.clientX;
                this.startY = e.clientY;
                this.selectionBox.style.left = this.startX + 'px';
                this.selectionBox.style.top = this.startY + 'px';
                this.selectionBox.style.width = '0px';
                this.selectionBox.style.height = '0px';
                this.selectionBox.style.display = 'block';
            };

            const handleMouseMove = (e) => {
                if (!this.selectionBox.style.display || this.selectionBox.style.display === 'none') {
                    return;
                }

                const currentX = e.clientX;
                const currentY = e.clientY;
                
                const width = Math.abs(currentX - this.startX);
                const height = Math.abs(currentY - this.startY);
                
                const left = Math.min(currentX, this.startX);
                const top = Math.min(currentY, this.startY);

                this.selectionBox.style.left = left + 'px';
                this.selectionBox.style.top = top + 'px';
                this.selectionBox.style.width = width + 'px';
                this.selectionBox.style.height = height + 'px';
            };

            const handleMouseUp = async (e) => {
                if (!this.selectionBox.style.display || this.selectionBox.style.display === 'none') {
                    return;
                }

                const rect = this.selectionBox.getBoundingClientRect();
                
                if (rect.width > 10 && rect.height > 10) {
                    try {
                        const dataUrl = await this.captureArea(rect, format, quality);
                        resolve(dataUrl);
                    } catch (error) {
                        reject(error);
                    }
                }

                this.cleanupSelection();
            };

            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    this.cleanupSelection();
                    reject(new Error('Selection cancelled'));
                }
            };

            // Add event listeners
            document.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('keydown', handleKeyDown);

            // Store cleanup function
            this.cleanupSelection = () => {
                document.removeEventListener('mousedown', handleMouseDown);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.removeEventListener('keydown', handleKeyDown);
                
                if (this.selectionBox) {
                    this.selectionBox.remove();
                    this.selectionBox = null;
                }
                
                this.isSelecting = false;
            };
        });
    }

    createSelectionOverlay() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.1);
            z-index: 999999;
            cursor: crosshair;
            user-select: none;
        `;

        // Create selection box
        this.selectionBox = document.createElement('div');
        this.selectionBox.style.cssText = `
            position: fixed;
            border: 2px solid #007acc;
            background: rgba(0, 122, 204, 0.1);
            z-index: 1000000;
            display: none;
            pointer-events: none;
        `;

        // Add elements to page
        document.body.appendChild(overlay);
        document.body.appendChild(this.selectionBox);

        // Store overlay for cleanup
        this.overlay = overlay;
    }

    async captureArea(rect, format, quality) {
        return new Promise((resolve, reject) => {
            try {
                // Create canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = rect.width;
                canvas.height = rect.height;

                // Set background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, rect.width, rect.height);

                // Capture the area using html2canvas
                html2canvas(document.body, {
                    width: rect.width,
                    height: rect.height,
                    x: rect.left + window.scrollX,
                    y: rect.top + window.scrollY,
                    scrollX: 0,
                    scrollY: 0,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                }).then(canvas => {
                    const dataUrl = canvas.toDataURL(`image/${format}`, quality);
                    resolve(dataUrl);
                }).catch(reject);

            } catch (error) {
                reject(error);
            }
        });
    }
}

// Initialize content script
const screenshotContent = new ScreenshotContentScript();

// Load html2canvas library if not already loaded
if (typeof html2canvas === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
    script.onload = () => {
        console.log('html2canvas loaded for Screenshot Pro');
    };
    document.head.appendChild(script);
} 