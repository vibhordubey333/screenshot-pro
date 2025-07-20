document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const captureVisibleBtn = document.getElementById('captureVisible');
    const captureFullPageBtn = document.getElementById('captureFullPage');
    const captureSelectionBtn = document.getElementById('captureSelection');
    const formatSelect = document.getElementById('format');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const statusDiv = document.getElementById('status');
    const openSettingsBtn = document.getElementById('openSettings');
    const viewHistoryBtn = document.getElementById('viewHistory');

    // Load saved settings
    loadSettings();

    // Event listeners
    captureVisibleBtn.addEventListener('click', () => captureScreenshot('visible'));
    captureFullPageBtn.addEventListener('click', () => captureScreenshot('fullpage'));
    captureSelectionBtn.addEventListener('click', () => captureScreenshot('selection'));
    
    qualitySlider.addEventListener('input', updateQualityDisplay);
    formatSelect.addEventListener('change', saveSettings);
    qualitySlider.addEventListener('change', saveSettings);
    
    openSettingsBtn.addEventListener('click', openSettings);
    viewHistoryBtn.addEventListener('click', viewHistory);

    function updateQualityDisplay() {
        qualityValue.textContent = qualitySlider.value + '%';
    }

    function loadSettings() {
        chrome.storage.sync.get(['format', 'quality'], function(result) {
            if (result.format) {
                formatSelect.value = result.format;
            }
            if (result.quality) {
                qualitySlider.value = result.quality;
                updateQualityDisplay();
            }
        });
    }

    function saveSettings() {
        chrome.storage.sync.set({
            format: formatSelect.value,
            quality: qualitySlider.value
        });
    }

    async function captureScreenshot(type) {
        try {
            // Disable buttons and show loading
            setButtonsState(false);
            showStatus('Capturing screenshot...', 'loading');

            // Get current tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab) {
                throw new Error('No active tab found');
            }

            // Send message to background script
            const response = await chrome.runtime.sendMessage({
                action: 'captureScreenshot',
                type: type,
                tabId: tab.id,
                format: formatSelect.value,
                quality: parseInt(qualitySlider.value) / 100
            });

            if (response.success) {
                showStatus('Screenshot captured successfully!', 'success');
                
                // Auto-download if enabled
                if (response.dataUrl) {
                    downloadScreenshot(response.dataUrl, tab.title || 'screenshot');
                }
            } else {
                throw new Error(response.error || 'Failed to capture screenshot');
            }

        } catch (error) {
            console.error('Screenshot error:', error);
            showStatus('Error: ' + error.message, 'error');
        } finally {
            setButtonsState(true);
        }
    }

    function setButtonsState(enabled) {
        const buttons = [captureVisibleBtn, captureFullPageBtn, captureSelectionBtn];
        buttons.forEach(btn => {
            btn.disabled = !enabled;
        });
    }

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.textContent = '';
                statusDiv.className = 'status';
            }, 3000);
        }
    }

    function downloadScreenshot(dataUrl, filename) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const extension = formatSelect.value;
        const fullFilename = `${filename}_${timestamp}.${extension}`;
        
        chrome.downloads.download({
            url: dataUrl,
            filename: fullFilename,
            saveAs: false
        });
    }

    function openSettings() {
        chrome.tabs.create({
            url: chrome.runtime.getURL('settings.html')
        });
    }

    function viewHistory() {
        chrome.tabs.create({
            url: chrome.runtime.getURL('history.html')
        });
    }

    // Initialize quality display
    updateQualityDisplay();
}); 