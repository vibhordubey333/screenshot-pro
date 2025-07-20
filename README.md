# Screenshot Pro - Browser Extension

A powerful browser extension for taking screenshots of any webpage, including DRM-protected content. Works with Chrome, Brave, and other Chromium-based browsers.

## Features

- **Capture Visible Area**: Screenshot the currently visible portion of the webpage
- **Capture Full Page**: Screenshot the entire webpage, including content below the fold
- **Area Selection**: Select and capture specific areas of the webpage
- **DRM Content Support**: Capture screenshots even on websites with DRM protection
- **Multiple Formats**: Save screenshots in PNG, JPEG, or WebP format
- **Quality Control**: Adjust image quality from 1% to 100%
- **Keyboard Shortcuts**: Quick capture using keyboard shortcuts
- **Auto Download**: Automatically download screenshots to your computer
- **Screenshot History**: View and manage your recent screenshots

## Installation

### Method 1: Load Unpacked Extension (Recommended)

1. Download or clone this repository to your computer
2. Open Chrome/Brave and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the folder containing the extension files
5. The extension should now appear in your extensions list

### Method 2: Install from Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store soon.

## Usage

### Using the Popup Interface

1. Click the Screenshot Pro icon in your browser toolbar
2. Choose your capture method:
   - **Capture Visible Area**: Screenshots what you can currently see
   - **Capture Full Page**: Screenshots the entire webpage
   - **Select Area**: Click and drag to select a specific area
3. Adjust format and quality settings as needed
4. Click the capture button to take your screenshot

### Using Keyboard Shortcuts

- **Ctrl+Shift+S** (Windows/Linux) or **Cmd+Shift+S** (Mac): Capture visible area
- **Ctrl+Shift+F** (Windows/Linux) or **Cmd+Shift+F** (Mac): Capture full page
- **Ctrl+Shift+A** (Windows/Linux) or **Cmd+Shift+A** (Mac): Start area selection

### Area Selection Mode

1. Click "Select Area" or use the keyboard shortcut
2. Click and drag to select the area you want to capture
3. Release the mouse button to capture the selected area
4. Press **Escape** to cancel the selection

## DRM Content Support

This extension uses advanced techniques to capture screenshots even on websites with DRM protection:

- **Desktop Capture API**: Falls back to desktop capture when standard methods fail
- **Canvas Override**: Bypasses canvas security restrictions
- **Protection Removal**: Removes common DRM protection overlays
- **Iframe Support**: Captures content within iframes

## Settings

### Format Options
- **PNG**: Lossless format, best for screenshots with text
- **JPEG**: Compressed format, smaller file sizes
- **WebP**: Modern format, good balance of quality and size

### Quality Settings
- Adjust from 1% to 100% quality
- Higher quality = larger file sizes
- Lower quality = smaller file sizes

## File Structure

```
ScreenshotPro/
├── manifest.json          # Extension manifest
├── popup.html            # Popup interface
├── popup.css             # Popup styles
├── popup.js              # Popup functionality
├── background.js         # Background service worker
├── content.js            # Content script
├── injected.js           # Enhanced functionality
├── icons/                # Extension icons
│   └── icon.svg          # SVG icon
└── README.md             # This file
```

## Technical Details

### Permissions Used

- `activeTab`: Access to the current tab
- `desktopCapture`: Capture desktop content for DRM support
- `downloads`: Download screenshots automatically
- `storage`: Save settings and screenshot history
- `tabs`: Access tab information
- `scripting`: Inject scripts for enhanced functionality

### Browser Compatibility

- Chrome 88+
- Brave 1.20+
- Other Chromium-based browsers

## Troubleshooting

### Screenshot Not Working
1. Make sure the extension is enabled
2. Try refreshing the webpage
3. Check if the website has strict security policies
4. Try using the desktop capture fallback

### DRM Content Not Capturing
1. The extension will automatically try desktop capture
2. Make sure you grant permission when prompted
3. Some DRM content may still be protected by hardware-level restrictions

### Performance Issues
1. Lower the quality setting
2. Try PNG format instead of JPEG/WebP
3. Close other browser tabs to free up memory

## Privacy & Security

- Screenshots are processed locally in your browser
- No data is sent to external servers
- Screenshots are saved to your local downloads folder
- The extension only accesses the current tab when activated

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed information about your problem

## Changelog

### Version 1.0.0
- Initial release
- Basic screenshot functionality
- DRM content support
- Multiple format options
- Keyboard shortcuts
- Area selection tool 