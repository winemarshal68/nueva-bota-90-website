# Photo Management Guide

This guide explains how to add and manage photos for the Nueva Bota 90 website.

## Overview

The website uses an **automatic photo manifest system** that scans your photo folder and generates a list of images for the gallery. You don't need to manually update any code when adding or removing photos.

## Quick Start

### 1. Add Your Photos

Drop your restaurant photos into this folder:
```
public/images/nueva-bota-90/
```

**Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`

### 2. Set Your Hero Image

Replace the hero image at:
```
public/images/hero.jpg
```

**Recommended size:** 1920×1080 pixels (landscape, 16:9 aspect ratio)

### 3. Generate the Manifest

Run this command to update the photo list:
```bash
npm run images
```

**Note:** This happens automatically during build, so you can skip this step if you're pushing to GitHub/Vercel.

### 4. Deploy

Push your changes to GitHub:
```bash
git add public/images/
git commit -m "Add restaurant photos"
git push
```

Vercel will automatically rebuild and deploy your site with the new photos.

---

## Detailed Instructions

### Photo Organization

#### Gallery Photos
- **Location:** `public/images/nueva-bota-90/`
- **Purpose:** Main photo gallery displayed on the Gallery page and home page preview
- **Naming:** Use descriptive names (e.g., `paella-closeup.jpg`, `interior-bar.jpg`)
- **Quantity:** Add all 60-70 photos here
- **Display Order:** Photos are sorted alphabetically by filename
  - Tip: Prefix with numbers for custom order (e.g., `01-hero-dish.jpg`, `02-dining-room.jpg`)

#### Hero Image
- **Location:** `public/images/hero.jpg`
- **Purpose:** Large background image on the homepage
- **Size:** 1920×1080 pixels (landscape)
- **Subject:** Best choice: wide shot of your restaurant interior or signature dish
- **Quality:** High quality, well-lit, appetizing

### Recommended Photo Sizes

| Type | Dimensions | Aspect Ratio | Purpose |
|------|------------|--------------|---------|
| Hero | 1920×1080 | 16:9 | Homepage background |
| Gallery | 1200×1200 | 1:1 (square) | Gallery grid |
| Gallery | 1200×900 | 4:3 | Gallery grid (alternate) |

### Photo Optimization

Before uploading, optimize your photos to reduce file sizes:

1. **Resize** images to recommended dimensions
2. **Compress** using tools like:
   - [TinyPNG](https://tinypng.com) - Free online compression
   - [ImageOptim](https://imageoptim.com) - Mac app
   - [Squoosh](https://squoosh.app) - Google's image optimizer
3. **Target:** Keep each image under 500KB
4. **Format:** JPG for photos, PNG for graphics with text

### How the Auto-Manifest Works

1. **Scanning:** The script scans `public/images/nueva-bota-90/`
2. **Filtering:** Ignores hidden files (`.DS_Store`, etc.)
3. **Sorting:** Alphabetically sorts images by filename
4. **Output:** Creates `content/images.json` with the list

**Example output:**
```json
[
  {
    "src": "/images/nueva-bota-90/dish-01.jpg",
    "filename": "dish-01.jpg"
  },
  {
    "src": "/images/nueva-bota-90/dish-02.jpg",
    "filename": "dish-02.jpg"
  }
]
```

### Manual Manifest Generation

If you want to regenerate the manifest without rebuilding:

```bash
npm run images
```

You'll see output like:
```
🖼️  Generating image manifest...
✓ Found 65 images
✓ Manifest saved: content/images.json
✓ Total images: 65
```

### Where Photos Appear

1. **Home Page**
   - Shows first 12 photos from the gallery in a preview grid
   - Pulls from `content/images.json`

2. **Gallery Page** (`/galeria`)
   - Shows all photos in a responsive grid
   - Click any photo to open lightbox
   - Keyboard navigation: Arrow keys, Escape to close

3. **Hero Section**
   - Uses `/images/hero.jpg`
   - Appears on the homepage background

### Troubleshooting

**Problem:** Photos don't appear after uploading

**Solutions:**
1. Run `npm run images` to regenerate the manifest
2. Check that images are in `public/images/nueva-bota-90/`
3. Verify file extensions are supported (`.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`)
4. Clear your browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

**Problem:** "No photos available" message on Gallery page

**Solutions:**
1. Add at least one photo to `public/images/nueva-bota-90/`
2. Run `npm run images`
3. Rebuild the site with `npm run build`

**Problem:** Hero image not loading

**Solutions:**
1. Verify `public/images/hero.jpg` exists
2. Check image size (should be reasonable, under 2MB)
3. Try a different image format (JPG recommended)
4. Clear browser cache and hard reload

### Best Practices

✅ **Do:**
- Use high-quality, well-lit photos
- Shoot in landscape for hero, square for gallery
- Compress images before uploading
- Use descriptive filenames
- Name files consistently (lowercase, hyphens instead of spaces)
- Test on mobile after uploading

❌ **Don't:**
- Upload raw camera files (too large)
- Use spaces in filenames
- Upload screenshots or low-resolution images
- Include sensitive information in photos
- Forget to run `npm run images` if testing locally

### Photo Checklist

Before launching the site, ensure you have:

- [ ] Replaced `public/images/hero.jpg` with your own hero image
- [ ] Added 60-70 gallery photos to `public/images/nueva-bota-90/`
- [ ] Optimized all images (under 500KB each)
- [ ] Used descriptive filenames
- [ ] Run `npm run images` to generate manifest
- [ ] Tested the gallery page loads correctly
- [ ] Tested hero image displays on homepage
- [ ] Checked mobile display
- [ ] Pushed changes to GitHub
- [ ] Verified deployment on Vercel

---

## Quick Reference

### Commands
```bash
# Generate image manifest
npm run images

# Build site (auto-generates manifest)
npm run build

# Start development server
npm run dev
```

### File Paths
```
public/images/hero.jpg              # Hero background image
public/images/nueva-bota-90/        # Gallery photos folder
content/images.json                 # Auto-generated manifest (don't edit manually)
```

### Recommended Tools
- **Compression:** [TinyPNG](https://tinypng.com)
- **Resizing:** [Squoosh](https://squoosh.app)
- **Mac Users:** [ImageOptim](https://imageoptim.com)

---

Need help? Check the main [README.md](../README.md) or contact your developer.
