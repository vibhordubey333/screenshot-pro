// Simple icon generator script
// This creates basic PNG icons for the extension

const fs = require('fs');
const path = require('path');

// Create a simple canvas-based icon generator
function createIcon(size) {
    // Create a simple data URL for a basic icon
    const canvas = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="url(#grad1)" stroke="#fff" stroke-width="2"/>
  
  <!-- Camera body -->
  <rect x="${size * 0.25}" y="${size * 0.3125}" width="${size * 0.5}" height="${size * 0.375}" rx="4" fill="#fff" opacity="0.9"/>
  
  <!-- Camera lens -->
  <circle cx="${size/2}" cy="${size/2}" r="${size * 0.125}" fill="#333"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size * 0.09375}" fill="#fff"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size * 0.0625}" fill="#333"/>
</svg>`;

    return canvas;
}

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
}

// Generate icons for different sizes
const sizes = [16, 32, 48, 128];

sizes.forEach(size => {
    const iconContent = createIcon(size);
    const filename = path.join(iconsDir, `icon${size}.svg`);
    fs.writeFileSync(filename, iconContent);
    console.log(`Generated icon${size}.svg`);
});

console.log('\n✅ Icons generated successfully!');
console.log('📝 Note: These are SVG files. For PNG icons:');
console.log('1. Open create_icons.html in your browser');
console.log('2. Right-click each canvas and save as PNG');
console.log('3. Save them as icon16.png, icon32.png, icon48.png, icon128.png'); 