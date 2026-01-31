/**
 * Generate PNG favicon variants from logo.svg
 *
 * IMPORTANT: This script only generates PNG files.
 * - The primary favicon.ico is located in app/favicon.ico (real ICO format)
 * - This script generates PNG variants for different sizes
 * - Do NOT generate public/favicon.ico to avoid conflicts with app/favicon.ico
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, '..', 'public', 'logo.svg');
const publicPath = path.join(__dirname, '..', 'public');

async function generateFavicons() {
  try {
    console.log('Generating PNG favicon variants from logo.svg...');

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

    // Note: favicon.ico should be manually created as a real ICO file in app/ directory
    // sharp cannot generate true .ico format, only PNG. Do NOT generate public/favicon.ico
    // to avoid conflicts with app/favicon.ico

    // Generate Apple Touch Icon (180x180)
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicPath, 'apple-touch-icon.png'));
    console.log('✓ Created apple-touch-icon.png');

    console.log('\n✓ All PNG favicon variants generated successfully!');
    console.log('ℹ️  Primary favicon.ico is maintained in app/favicon.ico');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
