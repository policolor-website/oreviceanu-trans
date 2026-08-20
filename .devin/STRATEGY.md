# TrendMyDrive — Strategy & Roadmap

## Brand Identity
- **Name:** TrendMyDrive
- **Business:** Chauffeur service & airport transfers (Germany + Europe)
- **Reference site:** https://heydriver.de/
- **Markets:** Germany, Europe
- **Languages:** English (base), German, French, Italian, Chinese

---

## Phase 1: Content Restructuring (Homepage)

Transform homepage from "Oreviceanu Logistic" (freight transport) to "TrendMyDrive" (chauffeur service).

### Sections (in order):

#### 1. Hero (DONE)
- Badge: "24-hour airport transfer - Professional chauffeurs"
- Title: "TrendMyDrive" (large, overlaid on car)
- Subtitle: "Exclusive airport transfers in Munich, Frankfurt, Berlin, Cologne/Bonn, Hamburg, Düsseldorf & more"
- Buttons: "About us" + "Our services"
- 3D Mercedes AMG GT 63 with sliding animation + wheel rotation + door opening

#### 2. How It Works (3 steps)
- Step 1: "Enter your route" — Pickup, destination, date, time
- Step 2: "Get a fixed price" — Transparent pricing, no hidden costs
- Step 3: "Relax and travel" — Professional chauffeur, on-time pickup
- Icons + short descriptions

#### 3. Why Choose Us (3 features)
- **Safe Travel** — Professional planning, fully insured, safety first
- **Professional Chauffeur** — Dark suit, shirt, tie. Always professional, always on time
- **Flight Monitoring** — We track your flight. Early or delayed, we're there on time

#### 4. Services (4 cards)
- **Airport Transfer** — Smooth, punctual transfers to/from all major European airports
- **Chauffeur Service** — Travel in comfort and elegance in our premium fleet
- **Day Tours** — Early morning or late arrival — we're available 24/7
- **Group Transfer** — From minibus to coach — reliable transport for groups of any size

#### 5. Fleet (5 vehicles)
| Vehicle | Class | Passengers | Luggage |
|---------|-------|-----------|---------|
| Mercedes S-Class | First Class Limousine | 3 | 3 |
| Mercedes E-Class | Business Class Limousine | 3 | 3 |
| Mercedes V-Class | Business Van | 7 | 7 |
| Mercedes Sprinter | Group Shuttle | 20 | 20+ |
| Large Coach | Travel Coach | 50 | 50+ |

Each vehicle: image, name, class, capacity, "Book now" button

#### 6. Popular Routes (from Munich)
| Route | Distance | Time |
|-------|---------|------|
| Munich Airport MUC | 40 km | 45 min |
| Tegernsee | 55 km | 1 hr |
| Garmisch / Zugspitze | 90 km | 1.5 hr |
| Memmingen Airport | 110 km | 1.5 hr |
| Neuschwanstein | 120 km | 2 hr |
| Salzburg | 145 km | 1.5 hr |
| Innsbruck | 160 km | 2 hr |
| Nuremberg | 170 km | 1.75 hr |

#### 7. Testimonials (Google reviews)
- 6 testimonials with name, initials, location, rating
- Google review badge
- Example content (rewrite, not copy):
  - "Extremely reliable service! Always on time, courteous and helpful..."
  - "As a consultant I travel a lot by plane — the cars are always immaculate..."
  - "The entire booking process was professional and smooth..."

#### 8. CTA Section
- "Book your chauffeur today — wherever you are in Europe"
- "Request a quote" button
- 24/7 availability emphasis

#### 9. FAQ (6 questions)
1. What areas do you cover? — Germany + all major European airports
2. What vehicle types do you offer? — E-Class, S-Class, V-Class, Sprinter, Coach
3. Are your services available 24/7? — Yes, 24/7 availability
4. Can I book short-term? — Yes, subject to vehicle availability
5. Do you offer Meet & Greet at the airport? — Yes, name sign, luggage assistance
6. Do you track flight arrivals/delays? — Yes, real-time flight monitoring

#### 10. Footer
- Company: TrendMyDrive GmbH
- Address: (to be defined)
- Phone: (to be defined)
- Email: (to be defined)
- WhatsApp link

---

## Phase 2: Internationalization (i18n)

### Setup
- Library: `next-intl` (standard for Next.js App Router)
- 5 locales: `en` (default), `de`, `fr`, `it`, `zh`

### URL Structure
```
/              → English (default)
/de            → German
/fr            → French
/it            → Italian
/zh            → Chinese
/de/leistungen → German services page
/fr/services   → French services page
```

### Translation Files
```
src/messages/
├── en.json    (English — base)
├── de.json    (German)
├── fr.json    (French)
├── it.json    (Italian)
└── zh.json    (Chinese)
```

### Translation Keys (structure)
```json
{
  "nav": { "home", "about", "fleet", "services", "contact" },
  "hero": { "badge", "title", "subtitle", "ctaAbout", "ctaServices", "scroll" },
  "howItWorks": { "title", "step1Title", "step1Desc", "step2Title", "step2Desc", "step3Title", "step3Desc" },
  "whyUs": { "title", "safeTitle", "safeDesc", "proTitle", "proDesc", "flightTitle", "flightDesc" },
  "services": { "title", "airportTitle", "airportDesc", "chauffeurTitle", "chauffeurDesc", "dayTourTitle", "dayTourDesc", "groupTitle", "groupDesc" },
  "fleet": { "title", "subtitle", "sClass", "eClass", "vClass", "sprinter", "coach", "passengers", "luggage", "book" },
  "routes": { "title", "subtitle", "munich", "tegernsee", ... },
  "testimonials": { "title", "subtitle", "reviews": [...] },
  "cta": { "title", "subtitle", "button" },
  "faq": { "title", "items": [...] },
  "footer": { "company", "address", "phone", "email", "rights" }
}
```

### Language Switcher
- Dropdown in header with flag icons
- Persists selection via cookie + URL prefix
- Auto-detect browser language on first visit

---

## Phase 3: Subpages

### /about (Über uns)
- Company story
- Team / chauffeurs
- Certifications & insurance
- Service area map

### /fleet (Flotte)
- Detailed vehicle pages
- Interior/exterior photos
- Specifications
- Pricing per vehicle

### /services (Leistungen)
- /services/airport-transfer
- /services/chauffeur-service
- /services/day-tours
- /services/group-transfer
- /services/diplomatic-chauffeur
- /services/event-transfer
- /services/messe-transfer
- Pricing & tariffs

### /contact (Kontakt)
- Booking form (route, date, time, passengers, luggage)
- WhatsApp integration
- Phone, email, address
- Map

### /booking (Buchen) — future
- Online booking system
- Route input → fixed price → confirm
- Payment integration

---

## Phase 4: Technical Optimization

### Performance
- [x] Draco decoder local (not CDN)
- [x] Shadow map adaptive (512 mobile, 1024 desktop)
- [x] Pixel ratio adaptive (1.0 mobile, 1.5 desktop)
- [x] Render loop stops when hero not visible
- [x] Scroll unlock instant (no jank)
- [ ] Lazy load 3D model (requestIdleCallback)
- [ ] Image optimization (next/image with WebP)
- [ ] Sitemap generation
- [ ] Meta tags per locale (hreflang)

### SEO
- Structured data (LocalBusiness, Service, FAQPage)
- Open Graph images per locale
- hreflang tags for all 5 languages
- Google Business Profile integration
- Schema.org markup for reviews

### Analytics
- Google Analytics 4
- Conversion tracking (booking form submits)
- Phone call tracking

---

## Phase 5: Brand Assets

### Needed
- [ ] Logo (TrendMyDrive)
- [ ] Favicon
- [ ] OG image
- [ ] Fleet photos (S-Class, E-Class, V-Class, Sprinter, Coach)
- [ ] Chauffeur photos (professional attire)
- [ ] Route/destination photos (Munich, Frankfurt, Berlin, etc.)

### Brand Colors
- **Background:** #0a0a0a (ink) — dark base
- **Surface:** dark canvas
- **Neon Green (primary accent):** #39FF14 → RGB(57, 255, 20)
  - Used for: titles with neon shadow/glow effect
  - CSS: `text-shadow: 0 0 10px rgba(57,255,20,0.5), 0 0 20px rgba(57,255,20,0.3)`
- **Electric Blue (secondary accent):** #0080FF → RGB(0, 128, 255)
  - Used for: icons, small UI elements, badges, details
- **Text:** white (#ffffff) for all body text
- **Color usage rules:**
  - Titles → neon green with glow shadow
  - Icons + small elements → electric blue
  - All other text → white
  - Background → dark (#0a0a0a)

---

## File Structure (planned)

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/page.tsx
│   │   ├── fleet/page.tsx
│   │   ├── services/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── contact/page.tsx
│   └── api/
├── components/
│   ├── building-hero-3d.tsx
│   ├── header.tsx (with language switcher)
│   ├── footer.tsx
│   ├── how-it-works.tsx
│   ├── why-us.tsx
│   ├── services-grid.tsx
│   ├── fleet-grid.tsx
│   ├── routes.tsx
│   ├── testimonials.tsx
│   ├── faq.tsx
│   └── language-switcher.tsx
├── i18n/
│   ├── routing.ts
│   ├── request.ts
│   └── config.ts
├── messages/
│   ├── en.json
│   ├── de.json
│   ├── fr.json
│   ├── it.json
│   └── zh.json
└── lib/
    └── brand.ts
```

---

## Priority Order
1. **i18n setup** — install next-intl, create locale structure
2. **Homepage rewrite** — all 10 sections with EN content
3. **Translation files** — EN base, then DE, FR, IT, ZH
4. **Language switcher** — header dropdown
5. **Subpages** — about, fleet, services, contact
6. **Brand assets** — logo, photos, OG images
7. **SEO** — hreflang, structured data, sitemap
8. **Booking system** — future phase
