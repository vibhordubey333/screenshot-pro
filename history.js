document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.getElementById('searchBox');
    const clearAll = document.getElementById('clearAll');
    const refreshHistory = document.getElementById('refreshHistory');
    const historyContainer = document.getElementById('historyContainer');
    const status = document.getElementById('status');

    let screenshotHistory = [];

    // Event listeners
    searchBox.addEventListener('input', filterHistory);
    clearAll.addEventListener('click', clearAllHistory);
    refreshHistory.addEventListener('click', loadHistory);

    // Load history on page load
    loadHistory();

    function loadHistory() {
        chrome.storage.local.get(['screenshotHistory'], function(result) {
            screenshotHistory = result.screenshotHistory || [];
            displayHistory(screenshotHistory);
        });
    }

    function displayHistory(history) {
        if (history.length === 0) {
            historyContainer.innerHTML = `
                <div class="empty-state">
                    <h3>No screenshots yet</h3>
                    <p>Take your first screenshot to see it here!</p>
                </div>
            `;
            return;
        }

        const historyHTML = history.map((item, index) => {
            const date = new Date(item.timestamp);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            
            return `
                <div class="history-item" data-index="${index}">
                    <img src="${item.dataUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjhGOEY5Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBwcmV2aWV3IGF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+'}" alt="Screenshot">
                    <div class="history-item-info">
                        <div class="history-item-title">${item.url || 'Unknown page'}</div>
                        <div class="history-item-meta">
                            <span>${item.type || 'visible'} • ${item.format || 'png'}</span>
                            <span>${formattedDate}</span>
                        </div>
                        <div class="history-item-actions">
                            <button class="btn btn-primary btn-small" onclick="downloadScreenshot(${index})">Download</button>
                            <button class="btn btn-secondary btn-small" onclick="deleteScreenshot(${index})">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        historyContainer.innerHTML = `
            <div class="history-list">
                ${historyHTML}
            </div>
        `;
    }

    function filterHistory() {
        const searchTerm = searchBox.value.toLowerCase();
        const filteredHistory = screenshotHistory.filter(item => {
            const url = (item.url || '').toLowerCase();
            const type = (item.type || '').toLowerCase();
            return url.includes(searchTerm) || type.includes(searchTerm);
        });
        displayHistory(filteredHistory);
    }

    function clearAllHistory() {
        if (confirm('Are you sure you want to clear all screenshot history? This action cannot be undone.')) {
            chrome.storage.local.remove(['screenshotHistory'], function() {
                screenshotHistory = [];
                displayHistory([]);
                showStatus('All screenshots cleared!', 'success');
            });
        }
    }

    function downloadScreenshot(index) {
        const item = screenshotHistory[index];
        if (item && item.dataUrl) {
            const timestamp = new Date(item.timestamp).toISOString().replace(/[:.]/g, '-');
            const filename = `screenshot_${timestamp}.${item.format || 'png'}`;
            
            chrome.downloads.download({
                url: item.dataUrl,
                filename: filename,
                saveAs: true
            });
        } else {
            showStatus('Screenshot data not available', 'error');
        }
    }

    function deleteScreenshot(index) {
        if (confirm('Are you sure you want to delete this screenshot?')) {
            screenshotHistory.splice(index, 1);
            chrome.storage.local.set({ screenshotHistory: screenshotHistory }, function() {
                displayHistory(screenshotHistory);
                showStatus('Screenshot deleted!', 'success');
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

    // Expose functions to global scope for onclick handlers
    window.downloadScreenshot = downloadScreenshot;
    window.deleteScreenshot = deleteScreenshot;
}); 