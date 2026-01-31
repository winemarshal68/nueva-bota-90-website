const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, '..', 'public', 'logo.svg');
const publicPath = path.join(__dirname, '..', 'public');

async function generateFavicons() {
  try {
    console.log('Generating favicons from logo.svg...');

    // Read SVG file
    const svgBuffer = fs.readFileSync(logoPath);

    // Generate 32x32 PNG
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicPath, 'favicon-32x32.png'));
    console.log('✓ Created favicon-32x32.png');

    // Generate 16x16 PNG
    await sharp(svgBuffer)
      .resize(16, 16)
      .png()
      .toFile(path.join(publicPath, 'favicon-16x16.png'));
    console.log('✓ Created favicon-16x16.png');

    // Generate ICO (using 32x32 as base)
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicPath, 'favicon.ico'));
    console.log('✓ Created favicon.ico');

    // Generate Apple Touch Icon (180x180)
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicPath, 'apple-touch-icon.png'));
    console.log('✓ Created apple-touch-icon.png');

    console.log('All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
