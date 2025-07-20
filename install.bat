@echo off
echo ========================================
echo    Screenshot Pro - Installation Helper
echo ========================================
echo.

echo Step 1: Opening icon generator...
start create_icons.html
echo.
echo Please generate the PNG icons:
echo 1. Right-click each canvas (16x16, 32x32, 48x48, 128x128)
echo 2. Save as PNG in the icons folder
echo 3. Name them: icon16.png, icon32.png, icon48.png, icon128.png
echo.

echo Step 2: Opening Chrome extensions page...
start chrome://extensions/
echo.
echo Please:
echo 1. Enable "Developer mode" (top-right toggle)
echo 2. Click "Load unpacked"
echo 3. Select this folder (ScreenshotPro)
echo.

echo Step 3: Opening Brave extensions page (if you use Brave)...
start brave://extensions/
echo.
echo Please:
echo 1. Enable "Developer mode" (top-right toggle)
echo 2. Click "Load unpacked"
echo 3. Select this folder (ScreenshotPro)
echo.

echo ========================================
echo Installation helper completed!
echo ========================================
echo.
echo Next steps:
echo 1. Generate PNG icons using the opened page
echo 2. Load the extension in your browser
echo 3. Test by clicking the extension icon
echo.
pause 