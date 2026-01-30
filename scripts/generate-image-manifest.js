#!/usr/bin/env node

/**
 * Image Manifest Generator
 * Scans public/images/nueva-bota-90/ and creates a JSON manifest
 * for dynamic gallery rendering
 */

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../public/images/nueva-bota-90');
const OUTPUT_FILE = path.join(__dirname, '../content/images.json');

// Valid image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

function generateManifest() {
  console.log('🖼️  Generating image manifest...');

  // Check if directory exists
  if (!fs.existsSync(IMAGES_DIR)) {
    console.warn(`⚠️  Directory not found: ${IMAGES_DIR}`);
    console.warn('⚠️  Creating empty manifest. Add photos to public/images/nueva-bota-90/');
    writeManifest([]);
    return;
  }

  // Read directory
  const files = fs.readdirSync(IMAGES_DIR);

  // Filter and process images
  const images = files
    .filter(file => {
      // Ignore hidden files
      if (file.startsWith('.')) return false;

      // Check for valid image extension
      const ext = path.extname(file).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    })
    .sort() // Stable alphabetical sort
    .map(filename => ({
      src: `/images/nueva-bota-90/${filename}`,
      filename: filename,
    }));

  if (images.length === 0) {
    console.warn('⚠️  No images found in public/images/nueva-bota-90/');
    console.warn('⚠️  Add photos and run: npm run images');
  } else {
    console.log(`✓ Found ${images.length} images`);
  }

  writeManifest(images);
}

function writeManifest(images) {
  // Ensure content directory exists
  const contentDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  // Write manifest
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(images, null, 2),
    'utf-8'
  );

  console.log(`✓ Manifest saved: ${path.relative(process.cwd(), OUTPUT_FILE)}`);
  console.log(`✓ Total images: ${images.length}`);
}

// Run generator
try {
  generateManifest();
  process.exit(0);
} catch (error) {
  console.error('❌ Error generating manifest:', error);
  process.exit(1);
}
