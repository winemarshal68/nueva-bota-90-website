# Nueva Bota 90 - Restaurant Website

A modern, bilingual restaurant website built with Next.js, TypeScript, and Tailwind CSS.

## Live Site

🚀 **GitHub Repository:** https://github.com/winemarshal68/nueva-bota-90-website

## Features

- ✨ **Bilingual (ES/EN)** - Language toggle with localStorage and URL params
- 📱 **Mobile-First Design** - Responsive on all devices
- 🎨 **Premium Layout** - Modern, agency-grade design
- 🍷 **Dynamic Menu & Wine Lists** - Google Sheets integration or JSON files
- 📊 **Google Sheets Integration** - Update menu directly from spreadsheets
- 🖼️ **Photo-Ready** - Optimized for stunning food photography
- ⚡ **Fast & SEO-Optimized** - Server-side rendering with 1-hour cache
- 🔄 **Automatic Fallback** - Uses local JSON if Google Sheets unavailable

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- lucide-react (icons)
- Google Sheets CSV integration
- Vercel-ready

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Google Sheets Integration

The menu and wine list can be managed directly from Google Sheets for easy updates without code changes.

### How It Works

1. **Spanish Menu/Wines**: Loaded from published Google Sheets CSV URLs
2. **English Menu/Wines**: Remains in local JSON files
3. **Automatic Updates**: Changes appear on the website within 1 hour
4. **Smart Fallback**: If Google Sheets is unavailable, uses local JSON files

### Setup Instructions

1. **Create Environment Variables**

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. **Add Google Sheets URLs**

Edit `.env.local` and add your published CSV URLs:
```env
NEXT_PUBLIC_GOOGLE_SHEET_CARTA_CSV_URL=https://docs.google.com/.../pub?gid=0&single=true&output=csv
NEXT_PUBLIC_GOOGLE_SHEET_VINOS_CSV_URL=https://docs.google.com/.../pub?gid=204872942&single=true&output=csv
```

3. **Publish Your Google Sheets**

For each sheet (CARTA and VINOS):
- Open Google Sheets
- File → Share → Publish to web
- Select the specific sheet
- Format: **Comma-separated values (.csv)**
- Click **Publish**
- Copy the URL to `.env.local`

4. **Configure Vercel**

In Vercel Dashboard → Project → Settings → Environment Variables:
- Add both `NEXT_PUBLIC_GOOGLE_SHEET_CARTA_CSV_URL` and `NEXT_PUBLIC_GOOGLE_SHEET_VINOS_CSV_URL`
- Set for: Production, Preview, Development
- Redeploy after adding

### CSV Structure

**CARTA (Food Menu):**
- Columns: `seccion`, `nombre`, `descripcion`, `precio`, `precio_media`, `precio_entera`, `disponible`, `orden`

**VINOS (Wine Menu):**
- Columns: `categoria`, `nombre`, `descripcion`, `origen`, `precio`, `disponible`, `orden`

### Owner Documentation

📖 **Full Spanish instructions for restaurant owners:**
See [docs/GOOGLE_SHEETS_INSTRUCCIONES.md](docs/GOOGLE_SHEETS_INSTRUCCIONES.md)

This comprehensive guide (in Spanish) explains:
- How to edit the menu
- How to hide/show items
- Price formatting
- Column structure
- Troubleshooting

## Edit Checklist for Maria

### 🔴 MUST DO (Critical)

1. **Update WhatsApp Link**
   - File: `content/i18n.ts`
   - Line: 50 (ES) and 104 (EN)
   - Change: `https://wa.me/34XXXXXXXXX` to your actual WhatsApp number
   - Format: `https://wa.me/34612345678` (include country code, no spaces)

2. **Update Instagram Handle**
   - File: `content/i18n.ts`
   - Line: 51 (ES) and 105 (EN)
   - Change: `https://instagram.com/nuevabota90` to your actual Instagram

3. **Replace Hero Image**
   - Replace the Unsplash URL in: `components/Hero.tsx` (line 17)
   - With your own hero image path: `/images/hero.jpg`
   - Recommended size: **1920x1080 pixels** (landscape)
   - Upload your image to: `public/images/hero.jpg`

4. **Replace Gallery Images**
   - File: `app/page.tsx` (lines 13-18)
   - Replace Unsplash URLs with your own images
   - Upload 4 square images to `public/images/` named `gallery-1.jpg` through `gallery-4.jpg`
   - Recommended size: **800x800 pixels** (square)

### 🟡 SHOULD DO (Important)

5. **Update Menu Prices** (Choose one method)

   **Option A - Google Sheets (Recommended):**
   - Set up Google Sheets integration (see "Google Sheets Integration" section)
   - Edit menu directly in Google Sheets - changes appear automatically
   - See [docs/GOOGLE_SHEETS_INSTRUCCIONES.md](docs/GOOGLE_SHEETS_INSTRUCCIONES.md) for details

   **Option B - Local JSON Files:**
   - Spanish menu: `data/carta_items.json`
   - English menu: `content/menu.en.json`
   - Edit the `"precio"` field for each item (format: "12.00")

6. **Update Wine List & Prices** (Choose one method)

   **Option A - Google Sheets (Recommended):**
   - Set up Google Sheets integration for wines
   - Edit wine list in Google Sheets

   **Option B - Local JSON Files:**
   - Spanish wines: `content/wine.es.json`
   - English wines: `content/wine.en.json`
   - Edit prices and add/remove wines as needed

7. **Verify Address & Hours**
   - File: `content/i18n.ts`
   - Lines 23-30 (ES) and 77-84 (EN)
   - Confirm address, opening hours, and closed days are correct

### 🟢 OPTIONAL (Nice to Have)

8. **Add More Gallery Images**
   - Edit `app/page.tsx` to add more images to the gallery
   - Create an array with more image URLs

9. **Customize Colors**
   - Primary colors are in Tailwind classes throughout components
   - Search for `stone-` to find color usage
   - Replace with your brand colors

## Deploying to Vercel

### Step 1: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **"Add New"** → **"Project"**
4. Import: `nueva-bota-90-website`
5. Click **"Deploy"** (no configuration needed!)

### Step 2: Connect Your Domain

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your domain (e.g., `nuevabota90.com`)

### Step 3: Configure DNS at one.com

Add these DNS records at your domain registrar (one.com):

```
Type    Name    Value                       TTL
A       @       76.76.21.21                 3600
CNAME   www     cname.vercel-dns.com        3600
```

**Note:** DNS changes can take 24-48 hours to propagate worldwide.

## Image Guidelines

### Recommended Image Sizes

| Image Type | Size | Aspect Ratio | Location |
|------------|------|--------------|----------|
| Hero | 1920×1080 | 16:9 | `public/images/hero.jpg` |
| Gallery | 800×800 | 1:1 | `public/images/gallery-*.jpg` |
| Food Plates | 1200×900 | 4:3 | `public/images/` |

### How to Add Images

1. Save your photos to `public/images/` folder
2. Name them descriptively (e.g., `paella.jpg`, `interior-1.jpg`)
3. Update the image paths in the code
4. Commit changes: `git add . && git commit -m "Add restaurant photos"`
5. Push to GitHub: `git push`
6. Vercel will auto-deploy the changes!

### Image Optimization Tips

- Use **JPG** for photos (better compression)
- Keep file sizes under **500KB** per image
- Use online tools like [TinyPNG](https://tinypng.com) to compress
- Shoot in good lighting for vibrant food colors
- Use landscape orientation for hero images
- Use square crops for gallery grids

## File Structure

```
nueva-bota-90-website/
├── app/
│   ├── page.tsx              # Home page
│   ├── menu/page.tsx         # Menu page (server component)
│   ├── vinos/page.tsx        # Wine page (server component)
│   ├── contacto/page.tsx     # Contact page
│   ├── layout.tsx            # Main layout with Header/Footer
│   └── globals.css           # Global styles
├── components/
│   ├── Header.tsx            # Navigation bar
│   ├── Hero.tsx              # Hero section
│   ├── Footer.tsx            # Footer
│   ├── ImageStrip.tsx        # Gallery component
│   └── MenuSection.tsx       # Menu/wine renderer
├── content/
│   ├── i18n.ts              # Site copy (ES/EN)
│   ├── menu.en.json         # English menu
│   └── wine.en.json         # English wines
├── data/
│   └── carta_items.json     # Spanish menu (fallback)
├── lib/
│   ├── csvParser.ts         # CSV parsing utilities
│   ├── menuDataFetcher.ts   # Google Sheets data fetcher
│   └── getServerLanguage.ts # Server-side language detection
├── hooks/
│   └── useLanguage.ts       # Language context (client)
├── docs/
│   └── GOOGLE_SHEETS_INSTRUCCIONES.md  # Spanish owner guide
└── public/
    └── images/              # Your photos go here!
```

## Support

- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs

## Built with Claude Code

This website was built with [Claude Code](https://claude.com/claude-code) - an AI-powered development assistant.

---

© 2025 Nueva Bota 90. All rights reserved.
