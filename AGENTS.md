# TrendMyDrive — Project Memory

## Project Overview
- **Type:** Chauffeur service website (airport transfers, premium car service)
- **Brand:** TrendMyDrive (formerly Oreviceanu Logistic — being rebranded)
- **Reference:** https://heydriver.de/
- **Stack:** Next.js 15 App Router + Three.js + Framer Motion + Tailwind CSS
- **Languages:** EN (base), DE, FR, IT, ZH (planned with next-intl)
- **Strategy file:** `.devin/STRATEGY.md` — full roadmap

## 3D Hero Section
- **Model:** Mercedes AMG GT 63 (`public/mercedes.glb`, 4.5MB, Draco+Meshopt compressed)
- **Decoders:** Local in `/public/draco/` (not CDN)
- **Animation phases:** arriving (slide from left) → doors (scroll-jacked)
- **Wheels:** Tires rotate on X axis, rims on Y axis (detected from local bbox)
- **Tire material:** `MeshBasicMaterial({ color: 0x000000 })` — pure black, ignores light
- **Interior:** `MeshBasicMaterial({ color: 0x000000 })` — prevents grey reflections
- **Door hinge:** Front edge (B-pillar), `REAR_DOOR_OPEN_ANGLE = Math.PI / 2.4`
- **Car scale:** Desktop 16, Mobile 12
- **Hero height:** `150vh` (page.tsx) + `heroHeight = innerHeight * 1.5` (3d component)

## Performance Optimizations
- `shadowMap.autoUpdate = false` — manual update only when car moves
- Shadow map: 512 mobile, 1024 desktop
- Pixel ratio: 1.0 mobile, 1.5 desktop
- Antialias: false on mobile
- Render loop skips when `window.scrollY > window.innerHeight`
- Resize handler debounced (150ms)
- Scroll unlock: instant in `onScroll` when `scrollProgress >= 1.0` (no lerp wait)

## Brand Config
- File: `src/lib/brand.ts`
- Name: "TrendMyDrive"
- Old freight transport content being replaced with chauffeur service content

## Brand Colors
- **Neon Green (primary):** `#39FF14` → RGB(57, 255, 20)
  - Titles with neon glow shadow: `text-shadow: 0 0 10px rgba(57,255,20,0.5), 0 0 20px rgba(57,255,20,0.3)`
- **Electric Blue (secondary):** `#0080FF` → RGB(0, 128, 255)
  - Icons, small UI elements, badges, details
- **Text:** white (#ffffff) for all body text
- **Background:** #0a0a0a (dark)
- **Rules:** Titles → neon green + glow | Icons + small → blue | All other text → white

## Key Files
- `src/components/building-hero-3d.tsx` — Three.js 3D hero
- `src/app/page.tsx` — homepage (being restructured)
- `src/lib/brand.ts` — brand config
- `src/app/globals.css` — global styles
- `.devin/STRATEGY.md` — full project roadmap

## Next Steps
1. Install next-intl for i18n (5 languages)
2. Restructure homepage with chauffeur service sections
3. Create translation files (en, de, fr, it, zh)
4. Build subpages (about, fleet, services, contact)
5. Language switcher in header
