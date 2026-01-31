# Nueva Bota 90 - Admin Page Implementation Plan

## Project Overview

**Objective:** Create an owner-only `/admin` page (Spanish language) that provides quick access to Google Sheets for managing menu content, protected by HTTP Basic Authentication.

**Reference:** Similar implementation exists on La Lola site.

**Global Requirement:** All code changes must be committed, pushed to GitHub, and deployed to Vercel.

---

## Current State Analysis

**Codebase Details:**
- **Framework:** Next.js 16.1.6 (App Router)
- **Authentication:** None currently exists
- **Middleware:** No middleware.ts file exists
- **Google Sheets:** Currently using CSV publish URLs only (not edit URLs)
- **Documentation:** Spanish documentation exists in `docs/GOOGLE_SHEETS_INSTRUCCIONES.md`
- **Deployment:** Vercel with automatic Git integration

**Existing Environment Variables:**
```env
NEXT_PUBLIC_GOOGLE_SHEET_CARTA_CSV_URL=https://docs.google.com/...output=csv
NEXT_PUBLIC_GOOGLE_SHEET_VINOS_CSV_URL=https://docs.google.com/...output=csv
```

---

## Requirements Breakdown

### A) `/admin` Page
- **Route:** `/admin`
- **Type:** Server component (default in App Router)
- **Language:** Spanish only (non-technical language)
- **Content:**
  - Page title and welcome message
  - Two prominent buttons (open in new tab):
    - "Abrir hoja de la carta" → Menu edit URL
    - "Abrir hoja de vinos" → Wine list edit URL
  - Info note: "Los cambios pueden tardar hasta 1 hora en reflejarse en la web."
- **Styling:** Match existing Nueva Bota 90 design (Tailwind CSS, stone color palette)

### B) Basic Auth Protection
- **Method:** HTTP Basic Auth via middleware.ts
- **Username:** Fixed as `admin`
- **Password:** From environment variable `ADMIN_PASSWORD`
- **Security:** Fail closed (deny access if ADMIN_PASSWORD not set)
- **UX:** Browser's native Basic Auth login prompt

### C) Documentation
- **File:** `docs/GOOGLE_SHEETS_INSTRUCCIONES.md`
- **New Section:** "Cómo Acceder al Panel de Administración"
- **Content:**
  - How to access `/admin`
  - Login credentials (username: admin)
  - Explanation of the two buttons
  - Note about 1-hour cache delay

### D) Environment Variables
**New Variables Required:**
```env
# Admin credentials
ADMIN_PASSWORD=<secret_password>

# Google Sheets edit URLs (not CSV publish URLs)
NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_CARTA=https://docs.google.com/spreadsheets/d/.../edit
NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_VINOS=https://docs.google.com/spreadsheets/d/.../edit
```

**Configuration Locations:**
1. Local: `.env.local` (for development)
2. Vercel: Environment Variables dashboard (for production)

---

## Implementation Plan

### Phase 1: Environment Setup

#### Step 1.1: Add Environment Variables to `.env.local`
**File:** `/Users/marshalwalkerm313/Projects/nueva-bota-90-website/.env.local`

**Action:** Add new variables
```env
# Admin authentication
ADMIN_PASSWORD=tu_contraseña_secreta_aqui

# Google Sheets edit URLs
NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_CARTA=https://docs.google.com/spreadsheets/d/1abc123.../edit
NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_VINOS=https://docs.google.com/spreadsheets/d/1abc123.../edit#gid=204872942
```

**Note:** The actual Google Sheets edit URLs need to be provided by the user. They should be in the format:
- Base URL: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
- With GID (for specific sheet): `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit#gid=[GID]`

#### Step 1.2: Update `.env.example`
**File:** `/Users/marshalwalkerm313/Projects/nueva-bota-90-website/.env.example`

**Action:** Add documentation for new variables
```env
# Google Sheets CSV URLs (public, read-only)
NEXT_PUBLIC_GOOGLE_SHEET_CARTA_CSV_URL=https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv
NEXT_PUBLIC_GOOGLE_SHEET_VINOS_CSV_URL=https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=123&single=true&output=csv

# Google Sheets Edit URLs (for admin panel)
NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_CARTA=https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_VINOS=https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit#gid=YOUR_GID

# Admin authentication password
ADMIN_PASSWORD=your_secret_password_here
```

---

### Phase 2: Create Middleware for Basic Auth

#### Step 2.1: Create `middleware.ts`
**File:** `/Users/marshalwalkerm313/Projects/nueva-bota-90-website/middleware.ts` (NEW)

**Purpose:** Intercept requests to `/admin` and require HTTP Basic Auth

**Implementation:**
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Get password from environment variable
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Fail closed: deny access if password not configured
  if (!adminPassword) {
    return new NextResponse('Admin access not configured', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  // Get authorization header
  const authHeader = request.headers.get('authorization');

  // Check if Basic Auth header exists
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    // Return 401 with WWW-Authenticate header to trigger browser login prompt
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Panel", charset="UTF-8"',
        'Content-Type': 'text/plain',
      },
    });
  }

  // Decode and validate credentials
  try {
    // Extract base64 credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    // Validate credentials
    const isValidUsername = username === 'admin';
    const isValidPassword = password === adminPassword;

    if (isValidUsername && isValidPassword) {
      // Authentication successful - allow request to proceed
      return NextResponse.next();
    } else {
      // Invalid credentials - return 401 again
      return new NextResponse('Invalid credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Panel", charset="UTF-8"',
          'Content-Type': 'text/plain',
        },
      });
    }
  } catch (error) {
    // Error decoding credentials
    return new NextResponse('Invalid authentication format', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

// Configure middleware to run only on /admin routes
export const config = {
  matcher: '/admin/:path*',
};
```

**Key Features:**
- ✅ Fixed username: `admin`
- ✅ Password from `ADMIN_PASSWORD` env var
- ✅ Fail closed: 503 error if password not set
- ✅ Browser native login prompt (WWW-Authenticate header)
- ✅ Only protects `/admin/*` routes
- ✅ Proper HTTP status codes (401, 503)

**Testing Checklist:**
- [ ] Accessing `/admin` triggers browser login prompt
- [ ] Correct credentials grant access
- [ ] Incorrect credentials show error
- [ ] Empty credentials rejected
- [ ] Works on both localhost and production

---

### Phase 3: Create `/admin` Page

#### Step 3.1: Create Admin Page Component
**File:** `/Users/marshalwalkerm313/Projects/nueva-bota-90-website/app/admin/page.tsx` (NEW)

**Type:** Server component (no 'use client' needed)

**Implementation:**
```typescript
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function AdminPage() {
  // Get Google Sheets edit URLs from environment variables
  const cartaEditUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_CARTA;
  const vinosEditUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_VINOS;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            Panel de Administración
          </h1>
          <p className="text-lg text-stone-600">
            Gestiona el contenido de la carta y la lista de vinos
          </p>
        </div>

        {/* Main content */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-stone-900 mb-6">
            Editar Hojas de Google
          </h2>

          <p className="text-stone-600 mb-8">
            Haz clic en los botones de abajo para abrir las hojas de Google donde puedes editar el contenido del menú.
          </p>

          {/* Buttons */}
          <div className="space-y-4">
            {/* Carta button */}
            {cartaEditUrl ? (
              <a
                href={cartaEditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
              >
                <span className="text-lg">Abrir hoja de la carta</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            ) : (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                ⚠️ URL de la carta no configurada
              </div>
            )}

            {/* Vinos button */}
            {vinosEditUrl ? (
              <a
                href={vinosEditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
              >
                <span className="text-lg">Abrir hoja de vinos</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            ) : (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                ⚠️ URL de vinos no configurada
              </div>
            )}
          </div>

          {/* Info note */}
          <div className="mt-8 bg-stone-100 border border-stone-300 rounded-lg p-4">
            <p className="text-stone-700 text-sm">
              <strong>Nota:</strong> Los cambios que hagas en las hojas pueden tardar hasta 1 hora en reflejarse en la web debido al sistema de caché.
            </p>
          </div>
        </div>

        {/* Additional instructions */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h3 className="text-xl font-semibold text-stone-900 mb-4">
            Instrucciones
          </h3>
          <ul className="space-y-3 text-stone-600">
            <li className="flex items-start">
              <span className="text-stone-900 font-semibold mr-2">1.</span>
              <span>Haz clic en el botón correspondiente para abrir la hoja de Google.</span>
            </li>
            <li className="flex items-start">
              <span className="text-stone-900 font-semibold mr-2">2.</span>
              <span>Edita el contenido directamente en la hoja (nombre, descripción, precio, disponibilidad, etc.).</span>
            </li>
            <li className="flex items-start">
              <span className="text-stone-900 font-semibold mr-2">3.</span>
              <span>Los cambios se guardan automáticamente en Google Sheets.</span>
            </li>
            <li className="flex items-start">
              <span className="text-stone-900 font-semibold mr-2">4.</span>
              <span>Espera hasta 1 hora para ver los cambios reflejados en la web.</span>
            </li>
          </ul>

          <div className="mt-6 pt-6 border-t border-stone-200">
            <p className="text-sm text-stone-500">
              Para más información sobre cómo editar las hojas, consulta la{' '}
              <Link href="/docs/GOOGLE_SHEETS_INSTRUCCIONES.md" className="text-stone-900 underline hover:text-stone-700">
                documentación completa
              </Link>.
            </p>
          </div>
        </div>

        {/* Back to home link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-stone-600 hover:text-stone-900 underline"
          >
            ← Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}

// Metadata for SEO (optional but recommended)
export const metadata = {
  title: 'Panel de Administración - Nueva Bota 90',
  robots: 'noindex, nofollow', // Don't index admin pages
};
```

**Key Features:**
- ✅ Spanish language throughout
- ✅ Non-technical, user-friendly text
- ✅ Two prominent buttons with external link icons
- ✅ Opens links in new tab (`target="_blank"`)
- ✅ 1-hour cache delay notice
- ✅ Error states if URLs not configured
- ✅ Matches Nueva Bota 90 design (stone colors)
- ✅ Responsive layout
- ✅ Clear instructions
- ✅ Meta robots tag to prevent search engine indexing

**Dependencies:**
- `lucide-react` - Already installed in package.json for ExternalLink icon

---

### Phase 4: Update Documentation

#### Step 4.1: Add Admin Panel Section to Existing Docs
**File:** `/Users/marshalwalkerm313/Projects/nueva-bota-90-website/docs/GOOGLE_SHEETS_INSTRUCCIONES.md`

**Action:** Add new section at the beginning (after title)

**New Content to Add:**
```markdown
## 🔐 Cómo Acceder al Panel de Administración

### Acceso Rápido

1. **URL:** Visita [https://tu-sitio-vercel.app/admin](https://tu-sitio-vercel.app/admin)

2. **Credenciales de acceso:**
   - **Usuario:** `admin`
   - **Contraseña:** (la que te proporcionó el desarrollador)

3. **Inicio de sesión:**
   - El navegador mostrará un cuadro de diálogo solicitando usuario y contraseña
   - Introduce las credenciales y haz clic en "Iniciar sesión"

### Panel de Administración

Una vez dentro del panel, verás dos botones principales:

- **Abrir hoja de la carta** → Te lleva directamente a la hoja de Google donde puedes editar el menú de comida
- **Abrir hoja de vinos** → Te lleva directamente a la hoja de Google donde puedes editar la lista de vinos

Los botones abrirán las hojas en una nueva pestaña del navegador para que puedas editar el contenido fácilmente.

### Importante

⏱️ **Los cambios pueden tardar hasta 1 hora en reflejarse en la web** debido al sistema de caché que optimiza la velocidad del sitio.

Si necesitas que los cambios aparezcan inmediatamente, contacta con el equipo técnico.

---

## 📝 Cómo Editar las Hojas de Google

[... resto del contenido existente ...]
```

**Changes:**
- Add new section at top explaining how to access `/admin`
- Explain login process (username: admin)
- Note about password (provided separately)
- Explain the two buttons
- Emphasize 1-hour cache delay
- Keep existing content intact

---

### Phase 5: Local Testing

#### Step 5.1: Test Locally

**Pre-requisites:**
- Ensure `.env.local` has all required variables set
- Server running (`npm run dev`)

**Test Cases:**

1. **Middleware Protection:**
   - [ ] Visit `http://localhost:3000/admin`
   - [ ] Verify browser shows Basic Auth login prompt
   - [ ] Enter incorrect credentials → Should show error
   - [ ] Enter correct credentials (admin + password from .env.local) → Should grant access

2. **Admin Page Functionality:**
   - [ ] After successful login, verify admin page loads
   - [ ] Check Spanish text displays correctly
   - [ ] Verify both buttons are visible and styled properly
   - [ ] Click "Abrir hoja de la carta" → Opens Google Sheet in new tab
   - [ ] Click "Abrir hoja de vinos" → Opens Google Sheet in new tab
   - [ ] Verify info note about 1-hour delay is visible

3. **Error Handling:**
   - [ ] Temporarily remove `ADMIN_PASSWORD` from .env.local
   - [ ] Restart dev server
   - [ ] Visit `/admin` → Should show 503 error (admin not configured)
   - [ ] Re-add password and restart → Should work again

4. **Responsive Design:**
   - [ ] Test on mobile viewport (Chrome DevTools)
   - [ ] Verify buttons stack properly on small screens
   - [ ] Check text readability on mobile

5. **Other Pages:**
   - [ ] Visit `/` → Should NOT require authentication
   - [ ] Visit `/menu` → Should NOT require authentication
   - [ ] Visit `/vinos` → Should NOT require authentication
   - [ ] Verify middleware only affects `/admin`

---

### Phase 6: Git Commit

#### Step 6.1: Stage and Commit Changes

**Files to Commit:**
1. `middleware.ts` (new)
2. `app/admin/page.tsx` (new)
3. `.env.example` (modified - add new env vars documentation)
4. `docs/GOOGLE_SHEETS_INSTRUCCIONES.md` (modified - add admin section)
5. `ADMIN_PAGE_IMPLEMENTATION_PLAN.md` (new - this plan)

**DO NOT COMMIT:**
- `.env.local` (contains secrets)

**Git Commands:**
```bash
# Stage all new files
git add middleware.ts
git add app/admin/page.tsx
git add .env.example
git add docs/GOOGLE_SHEETS_INSTRUCCIONES.md
git add ADMIN_PAGE_IMPLEMENTATION_PLAN.md

# Verify staged files
git status

# Commit with descriptive message
git commit -m "feat(admin): Add protected admin panel with Google Sheets access

- Create /admin page with Spanish UI for restaurant owners
- Add two buttons linking to Google Sheets edit URLs (carta + vinos)
- Implement HTTP Basic Auth via middleware.ts (username: admin)
- Protect /admin routes with ADMIN_PASSWORD env var
- Add admin access instructions to docs
- Fail closed: deny access if ADMIN_PASSWORD not configured

Features:
- Non-technical Spanish interface
- Browser native login prompt
- Opens sheets in new tab
- 1-hour cache delay notice included
- Responsive design matching site theme

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Phase 7: Deploy to Vercel

#### Step 7.1: Configure Vercel Environment Variables

**Before Pushing to GitHub:**

1. **Login to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Navigate to Nueva Bota 90 project

2. **Add Environment Variables:**
   - Go to: Settings → Environment Variables
   - Add the following variables for **Production** environment:

   ```
   Variable Name: ADMIN_PASSWORD
   Value: [your_secure_password_here]
   Environment: Production
   ```

   ```
   Variable Name: NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_CARTA
   Value: https://docs.google.com/spreadsheets/d/[YOUR_ID]/edit
   Environment: Production
   ```

   ```
   Variable Name: NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_VINOS
   Value: https://docs.google.com/spreadsheets/d/[YOUR_ID]/edit#gid=[GID]
   Environment: Production
   ```

3. **Optional: Add to Preview Environment**
   - If you want to test on preview deployments, also add to "Preview" environment
   - Use same or different credentials

**Security Best Practices:**
- Use a strong password for `ADMIN_PASSWORD` (minimum 16 characters, mix of letters, numbers, symbols)
- Never commit the password to Git
- Consider using a password manager to generate and store it

#### Step 7.2: Push to GitHub

```bash
# Push to main branch (triggers Vercel deployment)
git push origin main
```

#### Step 7.3: Verify Deployment

1. **Monitor Deployment:**
   - Vercel will automatically detect the push
   - Watch deployment progress in Vercel dashboard
   - Check for any build errors

2. **Check Build Logs:**
   - Ensure no TypeScript errors
   - Ensure no missing environment variable warnings
   - Verify build completes successfully

3. **Get Production URL:**
   - Copy production URL from Vercel dashboard
   - Example: `https://nueva-bota-90.vercel.app`

#### Step 7.4: Production Testing

**Test Cases:**

1. **Basic Auth:**
   - [ ] Visit `https://[your-domain].vercel.app/admin`
   - [ ] Verify browser login prompt appears
   - [ ] Test incorrect credentials → Should deny access
   - [ ] Test correct credentials → Should grant access

2. **Admin Page:**
   - [ ] Verify page loads after authentication
   - [ ] Check Spanish text renders correctly
   - [ ] Click both buttons → Should open correct Google Sheets
   - [ ] Verify sheets open in new tab

3. **Public Pages:**
   - [ ] Visit homepage → Should NOT require login
   - [ ] Visit `/menu` → Should NOT require login
   - [ ] Visit `/vinos` → Should NOT require login

4. **Mobile Testing:**
   - [ ] Open site on mobile device
   - [ ] Visit `/admin` → Should show mobile-friendly login prompt
   - [ ] Verify admin page is responsive

5. **Google Sheets Integration:**
   - [ ] Make a test edit in the Google Sheet
   - [ ] Wait up to 1 hour (or trigger manual revalidation)
   - [ ] Verify changes appear on production site

---

## File Changes Summary

### New Files (5)
1. **`middleware.ts`**
   - Purpose: HTTP Basic Auth for `/admin` routes
   - Lines: ~80
   - Dependencies: Next.js server APIs

2. **`app/admin/page.tsx`**
   - Purpose: Admin dashboard with Google Sheets links
   - Lines: ~150
   - Dependencies: lucide-react (ExternalLink icon)

3. **`ADMIN_PAGE_IMPLEMENTATION_PLAN.md`**
   - Purpose: This implementation plan
   - Lines: ~800
   - Dependencies: None

### Modified Files (2)
4. **`.env.example`**
   - Changes: Add documentation for new env vars
   - Lines added: ~6

5. **`docs/GOOGLE_SHEETS_INSTRUCCIONES.md`**
   - Changes: Add admin panel access section at top
   - Lines added: ~35

### Files NOT Changed
- All existing pages (`page.tsx`, `menu/page.tsx`, etc.)
- All existing components
- `package.json` (no new dependencies needed)
- `next.config.ts`
- `tsconfig.json`
- `.gitignore` (already ignores `.env.local`)

---

## Environment Variables Reference

### Development (`.env.local`)
```env
# Existing variables
NEXT_PUBLIC_GOOGLE_SHEET_CARTA_CSV_URL=https://docs.google.com/.../output=csv
NEXT_PUBLIC_GOOGLE_SHEET_VINOS_CSV_URL=https://docs.google.com/.../output=csv

# New variables for admin page
ADMIN_PASSWORD=your_local_dev_password
NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_CARTA=https://docs.google.com/spreadsheets/d/.../edit
NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_VINOS=https://docs.google.com/spreadsheets/d/.../edit#gid=...
```

### Production (Vercel Dashboard)
Same variables as above, but with production password.

### How to Get Google Sheets Edit URLs

1. **Open your Google Sheet**
2. **Copy URL from browser address bar**
3. **Format:**
   - Main sheet: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
   - Specific tab: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit#gid=[GID]`

4. **Find GID (sheet tab ID):**
   - Click on the tab you want to link
   - Look at URL in browser
   - Copy the number after `gid=`

**Example:**
```
URL: https://docs.google.com/spreadsheets/d/1abc123xyz/edit#gid=204872942
         └─────────────────┬─────────────┘              └────┬────┘
                    SPREADSHEET_ID                          GID
```

---

## Security Considerations

### ✅ Implemented Security Measures

1. **Fail Closed Design:**
   - If `ADMIN_PASSWORD` is not set, access is denied (503 error)
   - No default password fallback

2. **HTTP Basic Auth:**
   - Built-in browser authentication mechanism
   - Credentials required for every request
   - No session management complexity

3. **Environment Variable Protection:**
   - Password stored in env vars (never in code)
   - `.env.local` excluded from Git via `.gitignore`
   - Vercel environment variables encrypted at rest

4. **Route Isolation:**
   - Middleware only protects `/admin/*` routes
   - Public pages remain accessible
   - No authentication overhead on public routes

5. **No Search Engine Indexing:**
   - `robots: 'noindex, nofollow'` in metadata
   - Admin panel won't appear in Google search results

### ⚠️ Known Limitations

1. **Basic Auth is Not Highly Secure:**
   - Credentials sent with every request (base64 encoded, not encrypted)
   - Vulnerable to man-in-the-middle attacks without HTTPS
   - **Mitigation:** Vercel provides automatic HTTPS, so credentials are encrypted in transit

2. **No Session Timeout:**
   - Browser caches credentials until manually cleared
   - **Mitigation:** Acceptable for owner-only access; remind user to log out on shared computers

3. **Single User Account:**
   - All admins share same username/password
   - No audit trail of who made changes
   - **Mitigation:** Fine for single-owner restaurant; Google Sheets tracks edit history

4. **No Rate Limiting:**
   - No protection against brute-force password guessing
   - **Mitigation:** Use strong password (16+ characters); Vercel may provide some DDoS protection

### 🔮 Future Security Enhancements (Optional)

If stronger security is needed later:
- Implement NextAuth.js with OAuth (Google login)
- Add multi-user support with individual accounts
- Add rate limiting middleware
- Implement session timeout
- Add 2FA (two-factor authentication)
- Use encrypted cookies instead of Basic Auth

**For Current Use Case:** Basic Auth is sufficient for a single-owner restaurant admin panel.

---

## Testing Checklist

### Pre-Deployment Testing (Local)
- [ ] Install dependencies: `npm install`
- [ ] Create `.env.local` with all required variables
- [ ] Start dev server: `npm run dev`
- [ ] Visit `http://localhost:3000/admin`
- [ ] Test Basic Auth login prompt appears
- [ ] Test correct credentials grant access
- [ ] Test incorrect credentials denied
- [ ] Verify admin page loads with Spanish text
- [ ] Verify both buttons are visible and styled
- [ ] Click both buttons → verify they open (will show Google Sheets login if URLs valid)
- [ ] Test on mobile viewport (Chrome DevTools)
- [ ] Verify other pages still work without auth
- [ ] Test with `ADMIN_PASSWORD` removed → verify 503 error
- [ ] Run TypeScript check: `npm run build`
- [ ] Fix any type errors

### Post-Deployment Testing (Production)
- [ ] Git commit and push successful
- [ ] Vercel build completes without errors
- [ ] Check Vercel deployment logs
- [ ] Visit production URL: `https://[your-domain].vercel.app/admin`
- [ ] Test Basic Auth login on production
- [ ] Test admin page functionality on production
- [ ] Click both buttons → verify correct Google Sheets open
- [ ] Test on real mobile device
- [ ] Verify public pages still accessible
- [ ] Check browser console for errors (should be none)
- [ ] Test from different browsers (Chrome, Safari, Firefox)
- [ ] Share URL with restaurant owner for final approval

### Documentation Testing
- [ ] Read through updated `GOOGLE_SHEETS_INSTRUCCIONES.md`
- [ ] Verify instructions are clear and accurate
- [ ] Check all links work
- [ ] Ensure screenshots (if any) are current

---

## Rollback Plan

If critical issues arise after deployment:

### Option 1: Immediate Rollback (Revert Commit)
```bash
# Revert the last commit
git revert HEAD

# Push to trigger new deployment
git push origin main
```

Vercel will auto-deploy the previous working version.

### Option 2: Hotfix (Fix Forward)
If issue is minor:
1. Fix the issue locally
2. Test thoroughly
3. Commit fix
4. Push to GitHub
5. Verify Vercel deployment

### Option 3: Vercel Dashboard Rollback
1. Go to Vercel dashboard → Deployments
2. Find last working deployment
3. Click "..." menu → "Redeploy"
4. Select "Use existing build cache"
5. Confirm redeployment

---

## Success Criteria

✅ **Implementation Complete When:**

1. **Authentication Works:**
   - [ ] Visiting `/admin` shows browser login prompt
   - [ ] Correct credentials (admin + password) grant access
   - [ ] Incorrect credentials denied
   - [ ] Other pages remain public (no auth required)

2. **Admin Page Functional:**
   - [ ] Page loads successfully after authentication
   - [ ] All text is in Spanish and non-technical
   - [ ] Two buttons visible and properly styled
   - [ ] "Abrir hoja de la carta" button opens correct Google Sheet
   - [ ] "Abrir hoja de vinos" button opens correct Google Sheet
   - [ ] Both buttons open in new tab
   - [ ] 1-hour cache notice is visible
   - [ ] Page is responsive on mobile

3. **Environment Variables Configured:**
   - [ ] `ADMIN_PASSWORD` set in Vercel
   - [ ] `NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_CARTA` set in Vercel
   - [ ] `NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_VINOS` set in Vercel
   - [ ] `.env.example` updated with documentation

4. **Documentation Updated:**
   - [ ] `GOOGLE_SHEETS_INSTRUCCIONES.md` has new admin section
   - [ ] Instructions are clear and accurate
   - [ ] Login credentials explained (username: admin)
   - [ ] Buttons functionality explained

5. **Deployment Successful:**
   - [ ] Code committed with clear message
   - [ ] Pushed to GitHub
   - [ ] Vercel build succeeded
   - [ ] Production site working
   - [ ] No console errors in browser
   - [ ] Mobile responsive

6. **Owner Approval:**
   - [ ] Restaurant owner can access `/admin`
   - [ ] Owner can successfully log in
   - [ ] Owner can open both Google Sheets
   - [ ] Owner understands how to use the interface

---

## Post-Implementation Tasks

### Immediate (Day 1)
1. Share login credentials with restaurant owner (secure method: in-person, password manager, encrypted message)
2. Verify owner can access admin panel
3. Walk owner through button functionality
4. Confirm Google Sheets edit permissions are correct

### Short-term (Week 1)
1. Monitor for any access issues
2. Gather feedback from owner on UX
3. Make minor adjustments if needed
4. Verify 1-hour cache delay is acceptable (or adjust if needed)

### Long-term (Optional)
1. Consider adding direct edit functionality (avoid Google Sheets entirely)
2. Add analytics to track admin panel usage
3. Implement change preview feature
4. Add manual cache invalidation button

---

## Reference Links

**Official Documentation:**
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [HTTP Basic Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)

**Similar Implementations:**
- La Lola site admin (reference provided by user)

---

## Notes for Future Enhancements

### Potential Improvements
1. **Direct Editing:** Instead of linking to Google Sheets, build a form directly in `/admin` that updates the sheets via Google Sheets API
2. **Preview Mode:** Add a "Preview changes before publishing" feature
3. **Change History:** Show log of recent menu changes
4. **Multi-language Admin:** Add English version of admin panel
5. **Image Upload:** Allow uploading dish photos directly from admin panel
6. **Analytics:** Track most popular menu items, view counts, etc.
7. **Notifications:** Email/SMS alert when menu is updated
8. **Scheduled Changes:** Set menu items to automatically enable/disable at certain times

### Technical Debt to Address
- None identified for current scope
- Basic Auth is appropriate for current use case
- Could migrate to NextAuth.js if multi-user access needed

---

## Appendix A: File Tree After Implementation

```
nueva-bota-90-website/
├── app/
│   ├── admin/              ← NEW DIRECTORY
│   │   └── page.tsx        ← NEW FILE (admin dashboard)
│   ├── menu/
│   │   └── page.tsx
│   ├── vinos/
│   │   └── page.tsx
│   ├── galeria/
│   │   └── page.tsx
│   ├── contacto/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── docs/
│   ├── GOOGLE_SHEETS_INSTRUCCIONES.md  ← MODIFIED (add admin section)
│   └── PHOTOS.md
├── lib/
│   ├── menuDataFetcher.ts
│   └── ...
├── middleware.ts           ← NEW FILE (Basic Auth)
├── .env.example            ← MODIFIED (add new env vars)
├── .env.local              ← MODIFIED (add secrets, NOT COMMITTED)
├── ADMIN_PAGE_IMPLEMENTATION_PLAN.md  ← NEW FILE (this doc)
└── ...
```

---

## Appendix B: Testing Scenarios

### Scenario 1: First-Time Admin Access
**User:** Restaurant owner
**Steps:**
1. Open browser, visit `https://nueva-bota-90.vercel.app/admin`
2. Browser shows login dialog
3. Enter username: `admin`
4. Enter password: `[provided_password]`
5. Click "Log In" or press Enter

**Expected Result:**
- Admin dashboard loads
- Two buttons visible
- Spanish instructions clear

**Edge Cases:**
- Wrong password → Error message, can retry
- Forgot password → Contact developer
- Browser autocomplete → Should work if previously saved

---

### Scenario 2: Editing Menu via Google Sheets
**User:** Restaurant owner
**Steps:**
1. Access `/admin` (already logged in)
2. Click "Abrir hoja de la carta"
3. New tab opens with Google Sheet
4. Edit menu item (e.g., change price of "Tosta de Aguacate" from 8.50 to 9.00)
5. Sheet auto-saves
6. Wait 1 hour
7. Visit `https://nueva-bota-90.vercel.app/menu`

**Expected Result:**
- Price updated on menu page after ~1 hour
- No manual deployment needed
- Change reflected automatically

---

### Scenario 3: Mobile Access
**User:** Restaurant owner on smartphone
**Steps:**
1. Open mobile browser (Safari on iPhone or Chrome on Android)
2. Visit `/admin`
3. Enter credentials in mobile login dialog
4. View admin page
5. Tap "Abrir hoja de la carta"

**Expected Result:**
- Login dialog mobile-friendly
- Admin page responsive (buttons not too small)
- Google Sheet opens in new mobile tab
- Can edit sheet on mobile (Google Sheets mobile editor)

---

## Appendix C: Troubleshooting Guide

### Problem: Login Prompt Doesn't Appear
**Symptoms:** Visit `/admin`, no login prompt, page loads immediately or shows error
**Possible Causes:**
- Middleware not running
- Route matcher misconfigured
- Cached response from previous session

**Solutions:**
1. Clear browser cache and cookies
2. Try incognito/private browsing mode
3. Check middleware.ts `config.matcher` is set to `/admin/:path*`
4. Verify middleware.ts is in project root (not in `/app`)
5. Restart Next.js dev server: `npm run dev`

---

### Problem: 503 Error "Admin access not configured"
**Symptoms:** Login prompt appears, but shows 503 error
**Cause:** `ADMIN_PASSWORD` environment variable not set

**Solutions:**
1. **Local Development:**
   - Check `.env.local` has `ADMIN_PASSWORD=...`
   - Restart dev server after adding env var

2. **Production (Vercel):**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add `ADMIN_PASSWORD` with value
   - Trigger new deployment (or wait for next push)

---

### Problem: Invalid Credentials (with correct password)
**Symptoms:** Entering correct password still shows error
**Possible Causes:**
- Password has special characters causing encoding issues
- Copy-paste added invisible characters
- Environment variable not loaded properly

**Solutions:**
1. Try typing password manually (don't copy-paste)
2. Check for trailing spaces in `.env.local` or Vercel env vars
3. Try simpler password temporarily to isolate issue
4. Check browser console for any JavaScript errors
5. Verify middleware is reading env var: add console.log temporarily

---

### Problem: Buttons Don't Open Google Sheets
**Symptoms:** Clicking buttons does nothing or shows error
**Possible Causes:**
- `NEXT_PUBLIC_GOOGLE_SHEET_EDIT_URL_*` env vars not set
- URLs are malformed
- Browser popup blocker

**Solutions:**
1. Check Vercel env vars are set correctly
2. Verify URLs are in format: `https://docs.google.com/spreadsheets/d/.../edit`
3. Disable popup blocker temporarily
4. Check browser console for errors
5. Verify URLs work by pasting directly in browser

---

### Problem: Changes to Google Sheet Don't Appear on Site
**Symptoms:** Edited sheet, waited 1+ hour, changes not visible
**Possible Causes:**
- Edited wrong sheet
- CSV publish URL not configured
- Cache not expiring
- Changes made to different GID

**Solutions:**
1. Verify you're editing the correct sheet (check sheet name)
2. Check `NEXT_PUBLIC_GOOGLE_SHEET_CARTA_CSV_URL` still points to correct sheet
3. Wait longer (cache can take up to 1 hour)
4. Manually trigger revalidation (advanced - requires developer)
5. Check Google Sheet publish settings: File → Share → Publish to web

---

### Problem: Admin Page Not Responsive on Mobile
**Symptoms:** Page looks broken on mobile, buttons too small or misaligned
**Solutions:**
1. Check Tailwind CSS responsive classes are applied
2. Test with Chrome DevTools mobile emulation
3. Verify viewport meta tag in layout.tsx
4. Check for any custom CSS overriding Tailwind

---

### Problem: Can't Log Out
**Symptoms:** Want to clear credentials, but no logout button
**Explanation:** HTTP Basic Auth doesn't have "logout" - browser caches credentials

**Solutions:**
1. **Clear browser cache and cookies**
2. **Close all browser tabs and reopen**
3. **Use private/incognito mode for one-time access**
4. **Browser-specific methods:**
   - Chrome: Settings → Privacy → Clear browsing data
   - Safari: Safari → Preferences → Privacy → Manage Website Data
   - Firefox: Settings → Privacy & Security → Clear Data

---

End of Implementation Plan
