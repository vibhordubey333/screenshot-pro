// Injected script for enhanced screenshot capabilities
(function() {
    'use strict';

    // Enhanced screenshot functionality
    window.ScreenshotPro = {
        // Override canvas security restrictions for DRM content
        overrideCanvasSecurity: function() {
            const originalGetContext = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function(type, attributes) {
                const context = originalGetContext.call(this, type, attributes);
                
                if (context && type === '2d') {
                    // Override security restrictions
                    const originalGetImageData = context.getImageData;
                    context.getImageData = function(sx, sy, sw, sh) {
                        try {
                            return originalGetImageData.call(this, sx, sy, sw, sh);
                        } catch (e) {
                            // Handle security exceptions
                            console.warn('Canvas security restriction encountered, using fallback');
                            return this.createImageData(sw, sh);
                        }
                    };
                }
                
                return context;
            };
        },

        // Enhanced video capture for DRM content
        captureVideoFrame: function(videoElement, format, quality) {
            return new Promise((resolve, reject) => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    canvas.width = videoElement.videoWidth;
                    canvas.height = videoElement.videoHeight;
                    
                    // Try to draw video frame
                    ctx.drawImage(videoElement, 0, 0);
                    
                    const dataUrl = canvas.toDataURL(`image/${format}`, quality);
                    resolve(dataUrl);
                } catch (error) {
                    reject(error);
                }
            });
        },

        // Capture iframe content
        captureIframe: function(iframe, format, quality) {
            return new Promise((resolve, reject) => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const iframeBody = iframeDoc.body;
                    
                    if (!iframeBody) {
                        reject(new Error('Iframe body not accessible'));
                        return;
                    }

                    // Create canvas for iframe content
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    canvas.width = iframe.offsetWidth;
                    canvas.height = iframe.offsetHeight;
                    
                    // Set background
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    // Use html2canvas for iframe content
                    if (typeof html2canvas !== 'undefined') {
                        html2canvas(iframeBody, {
                            width: canvas.width,
                            height: canvas.height,
                            useCORS: true,
                            allowTaint: true,
                            backgroundColor: '#ffffff'
                        }).then(iframeCanvas => {
                            ctx.drawImage(iframeCanvas, 0, 0);
                            const dataUrl = canvas.toDataURL(`image/${format}`, quality);
                            resolve(dataUrl);
                        }).catch(reject);
                    } else {
                        reject(new Error('html2canvas not available'));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        },

        // Enhanced full page capture with iframe support
        captureFullPageEnhanced: function(format, quality) {
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

                    // Create main canvas
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = width;
                    canvas.height = height;

                    // Set background
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, width, height);

                    // Find all iframes
                    const iframes = document.querySelectorAll('iframe');
                    const iframePromises = [];

                    // Capture iframe contents
                    iframes.forEach((iframe, index) => {
                        try {
                            const iframeRect = iframe.getBoundingClientRect();
                            const iframePromise = this.captureIframe(iframe, format, quality)
                                .then(dataUrl => {
                                    return {
                                        dataUrl: dataUrl,
                                        x: iframeRect.left + window.scrollX,
                                        y: iframeRect.top + window.scrollY,
                                        width: iframeRect.width,
                                        height: iframeRect.height
                                    };
                                })
                                .catch(error => {
                                    console.warn(`Failed to capture iframe ${index}:`, error);
                                    return null;
                                });
                            iframePromises.push(iframePromise);
                        } catch (error) {
                            console.warn(`Error processing iframe ${index}:`, error);
                        }
                    });

                    // Capture main page content
                    const mainPagePromise = new Promise((resolveMain) => {
                        if (typeof html2canvas !== 'undefined') {
                            html2canvas(body, {
                                width: width,
                                height: height,
                                useCORS: true,
                                allowTaint: true,
                                backgroundColor: '#ffffff'
                            }).then(mainCanvas => {
                                ctx.drawImage(mainCanvas, 0, 0);
                                resolveMain();
                            }).catch(() => {
                                resolveMain();
                            });
                        } else {
                            resolveMain();
                        }
                    });

                    // Wait for all captures to complete
                    Promise.all([mainPagePromise, ...iframePromises])
                        .then((results) => {
                            // Overlay iframe captures
                            results.slice(1).forEach(result => {
                                if (result) {
                                    const img = new Image();
                                    img.onload = () => {
                                        ctx.drawImage(img, result.x, result.y, result.width, result.height);
                                    };
                                    img.src = result.dataUrl;
                                }
                            });

                            // Return final result
                            setTimeout(() => {
                                const dataUrl = canvas.toDataURL(`image/${format}`, quality);
                                resolve(dataUrl);
                            }, 500);
                        })
                        .catch(reject);

                } catch (error) {
                    reject(error);
                }
            });
        },

        // Remove DRM protection indicators
        removeDRMIndicators: function() {
            // Remove common DRM protection overlays
            const selectors = [
                '.drm-overlay',
                '.protection-overlay',
                '.no-screenshot',
                '[data-protection]',
                '.copy-protection'
            ];

            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    el.style.display = 'none';
                });
            });

            // Override common protection methods
            if (window.navigator.mediaSession) {
                window.navigator.mediaSession.setActionHandler = function() {};
            }

            // Disable right-click protection
            document.addEventListener('contextmenu', function(e) {
                e.stopImmediatePropagation();
                return true;
            }, true);

            // Disable keyboard shortcuts protection
            document.addEventListener('keydown', function(e) {
                if (e.ctrlKey || e.metaKey) {
                    e.stopImmediatePropagation();
                    return true;
                }
            }, true);
        },

        // Initialize enhanced functionality
        init: function() {
            this.overrideCanvasSecurity();
            this.removeDRMIndicators();
            console.log('Screenshot Pro enhanced functionality initialized');
        }
    };

    // Auto-initialize
    ScreenshotPro.init();

    // Expose to window for content script access
    window.ScreenshotProEnhanced = ScreenshotPro;

})(); 