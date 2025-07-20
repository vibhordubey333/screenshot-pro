document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const defaultFormat = document.getElementById('defaultFormat');
    const defaultQuality = document.getElementById('defaultQuality');
    const qualityValue = document.getElementById('qualityValue');
    const autoDownload = document.getElementById('autoDownload');
    const showNotifications = document.getElementById('showNotifications');
    const enableDRMBypass = document.getElementById('enableDRMBypass');
    const captureIframes = document.getElementById('captureIframes');
    const removeProtectionOverlays = document.getElementById('removeProtectionOverlays');
    const maxHistory = document.getElementById('maxHistory');
    const clearHistory = document.getElementById('clearHistory');
    const saveSettings = document.getElementById('saveSettings');
    const resetSettings = document.getElementById('resetSettings');
    const status = document.getElementById('status');

    // Load settings
    loadSettings();

    // Event listeners
    defaultQuality.addEventListener('input', updateQualityDisplay);
    saveSettings.addEventListener('click', saveAllSettings);
    resetSettings.addEventListener('click', resetToDefaults);
    clearHistory.addEventListener('click', clearScreenshotHistory);

    function updateQualityDisplay() {
        qualityValue.textContent = defaultQuality.value + '%';
    }

    function loadSettings() {
        chrome.storage.sync.get([
            'format',
            'quality',
            'autoDownload',
            'showNotifications',
            'enableDRMBypass',
            'captureIframes',
            'removeProtectionOverlays',
            'maxHistory'
        ], function(result) {
            if (result.format) defaultFormat.value = result.format;
            if (result.quality) {
                defaultQuality.value = result.quality;
                updateQualityDisplay();
            }
            if (result.autoDownload !== undefined) autoDownload.checked = result.autoDownload;
            if (result.showNotifications !== undefined) showNotifications.checked = result.showNotifications;
            if (result.enableDRMBypass !== undefined) enableDRMBypass.checked = result.enableDRMBypass;
            if (result.captureIframes !== undefined) captureIframes.checked = result.captureIframes;
            if (result.removeProtectionOverlays !== undefined) removeProtectionOverlays.checked = result.removeProtectionOverlays;
            if (result.maxHistory) maxHistory.value = result.maxHistory;
        });
    }

    function saveAllSettings() {
        const settings = {
            format: defaultFormat.value,
            quality: parseInt(defaultQuality.value),
            autoDownload: autoDownload.checked,
            showNotifications: showNotifications.checked,
            enableDRMBypass: enableDRMBypass.checked,
            captureIframes: captureIframes.checked,
            removeProtectionOverlays: removeProtectionOverlays.checked,
            maxHistory: parseInt(maxHistory.value)
        };

        chrome.storage.sync.set(settings, function() {
            showStatus('Settings saved successfully!', 'success');
        });
    }

    function resetToDefaults() {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            const defaultSettings = {
                format: 'png',
                quality: 90,
                autoDownload: true,
                showNotifications: true,
                enableDRMBypass: true,
                captureIframes: true,
                removeProtectionOverlays: true,
                maxHistory: 50
            };

            chrome.storage.sync.set(defaultSettings, function() {
                loadSettings();
                showStatus('Settings reset to defaults!', 'success');
            });
        }
    }

    function clearScreenshotHistory() {
        if (confirm('Are you sure you want to clear all screenshot history? This action cannot be undone.')) {
            chrome.storage.local.remove(['screenshotHistory'], function() {
                showStatus('Screenshot history cleared!', 'success');
            });
        }
    }

    function showStatus(message, type) {
        status.textContent = message;
        status.className = `status ${type}`;
        status.style.display = 'block';
        
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }

    // Initialize quality display
    updateQualityDisplay();
}); 