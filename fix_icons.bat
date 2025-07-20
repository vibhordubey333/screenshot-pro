@echo off
echo ========================================
echo    Screenshot Pro - Icon Fix Helper
echo ========================================
echo.

echo The extension failed to load because icons are missing.
echo Let's fix this step by step:
echo.

echo Step 1: Opening PNG Icon Generator...
start create_png_icons.html
echo.
echo Please:
echo 1. Click "Download All Icons" button
echo 2. Move the downloaded files to the icons folder
echo 3. Rename them to: icon16.png, icon32.png, icon48.png, icon128.png
echo.

echo Step 2: After downloading icons, press any key to continue...
pause

echo.
echo Step 3: Opening Chrome extensions page...
start chrome://extensions/
echo.
echo Please:
echo 1. Find "Screenshot Pro" in the list
echo 2. Click the "Reload" button (circular arrow icon)
echo 3. The extension should now load successfully!
echo.

echo Step 4: Opening Brave extensions page (if you use Brave)...
start brave://extensions/
echo.
echo Please:
echo 1. Find "Screenshot Pro" in the list
echo 2. Click the "Reload" button (circular arrow icon)
echo 3. The extension should now load successfully!
echo.

echo ========================================
echo Icon fix completed!
echo ========================================
echo.
echo The extension should now work properly.
echo Test it by clicking the Screenshot Pro icon in your toolbar!
echo.
pause 