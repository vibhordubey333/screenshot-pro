# Installation Guide - Screenshot Pro

## Prerequisites

- Google Chrome, Brave, or any Chromium-based browser
- Browser version 88 or higher (for Manifest V3 support)

## Installation Steps

### Step 1: Download the Extension

1. Download or clone this repository to your computer
2. Extract the files if they're in a compressed format
3. Make sure all files are in a single folder

### Step 2: Generate Icons (Optional)

If you want custom icons:

1. Open `create_icons.html` in your browser
2. Right-click on each canvas and save as PNG
3. Save them as:
   - `icons/icon16.png`
   - `icons/icon32.png`
   - `icons/icon48.png`
   - `icons/icon128.png`

### Step 3: Load the Extension

1. Open your browser and navigate to the extensions page:
   - **Chrome**: `chrome://extensions/`
   - **Brave**: `brave://extensions/`

2. Enable "Developer mode" by toggling the switch in the top-right corner

3. Click "Load unpacked" button

4. Select the folder containing the extension files (the folder with `manifest.json`)

5. The extension should now appear in your extensions list

### Step 4: Verify Installation

1. Look for "Screenshot Pro" in your extensions list
2. The extension icon should appear in your browser toolbar
3. Click the icon to open the popup interface

## File Structure

Make sure your extension folder contains these files:

```
ScreenshotPro/
├── manifest.json          # Extension configuration
├── popup.html            # Popup interface
├── popup.css             # Popup styles
├── popup.js              # Popup functionality
├── background.js         # Background service worker
├── content.js            # Content script
├── injected.js           # Enhanced functionality
├── settings.html         # Settings page
├── settings.js           # Settings functionality
├── history.html          # History page
├── history.js            # History functionality
├── create_icons.html     # Icon generator
├── icons/                # Extension icons (optional)
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── README.md             # Documentation
├── INSTALLATION.md       # This file
└── LICENSE               # License file
```

## Troubleshooting

### Extension Won't Load

1. **Check file structure**: Make sure all required files are present
2. **Check manifest.json**: Ensure it's valid JSON
3. **Check browser version**: Update to the latest version
4. **Check console errors**: Open Developer Tools and check for errors

### Extension Loads But Doesn't Work

1. **Check permissions**: Make sure the extension has necessary permissions
2. **Refresh pages**: Try refreshing the webpage you want to screenshot
3. **Check console**: Look for JavaScript errors in the console
4. **Disable other extensions**: Some extensions might conflict

### DRM Content Not Capturing

1. **Grant permissions**: Allow the extension to capture screen when prompted
2. **Try desktop capture**: The extension will automatically fall back to desktop capture
3. **Check website**: Some websites have hardware-level DRM protection

### Icons Not Showing

1. **Generate icons**: Use the `create_icons.html` file to generate icons
2. **Check file names**: Make sure icon files are named correctly
3. **Check file format**: Icons should be PNG format
4. **Reload extension**: Remove and reload the extension

## Updating the Extension

1. Download the latest version
2. Remove the old extension from `chrome://extensions/`
3. Load the new version using "Load unpacked"
4. Your settings and history will be preserved

## Uninstalling

1. Go to `chrome://extensions/`
2. Find "Screenshot Pro" in the list
3. Click "Remove" or toggle the extension off
4. Your screenshot history will be deleted

## Support

If you encounter issues:

1. Check this installation guide
2. Read the main README.md file
3. Check the troubleshooting section
4. Create an issue on the project repository

## Security Note

This extension:
- Processes screenshots locally in your browser
- Does not send data to external servers
- Only accesses the current tab when activated
- Requires permissions for screenshot functionality

## Permissions Explained

- **activeTab**: Access to the current tab for screenshots
- **desktopCapture**: Capture desktop content for DRM support
- **downloads**: Download screenshots automatically
- **storage**: Save settings and screenshot history
- **tabs**: Access tab information
- **scripting**: Inject scripts for enhanced functionality
- **host_permissions**: Access to all URLs for screenshot capture 