# Malmö Bygg & Riv AB – website

Static website for a Malmö contractor offering demolition (rivning), remediation (sanering), concrete cutting (håltagning), new construction and renovation. Swedish at `/`, English at `/en/`.

**Stack:** Astro 7 · TypeScript (strict) · Tailwind CSS 4 · Content Collections · `astro:assets` (AVIF/WebP, responsive `srcset`) · self-hosted font (Source Sans 3) · fully static output.

**Design system:** [docs/STYLE.md](docs/STYLE.md) ("Nordic Industrial Corporate"). All visual changes follow it. The top of that file lists where this site deliberately departs from it.

**Verified build:** `astro check` reports 0 errors, 0 warnings and 0 hints, and the build produces 49 pages. Lighthouse (mobile preset) scores 94–100 on Performance and 100 on Accessibility, Best Practices and SEO on the pages tested. The quote and application forms were tested end-to-end in both languages.

---

## 1. Setup

Requirements: **Node.js ≥ 22.23.4** (Astro 7 requirement; Node 24 LTS recommended – see `.nvmrc`).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # type check + static build to dist/
npm run preview   # serve dist/ locally
```

Other scripts:

| Script | What it does |
| --- | --- |
| `npm run photos` | Downloads stock photos from Pexels into `src/assets/stock/` (needs `PEXELS_API_KEY` in `.env`). Add `-- --force` to re-download. |
| `npm run images` | Regenerates the labelled placeholder images in `src/assets/placeholders/`. |

> **Windows note:** the npm scripts call `node ./node_modules/astro/bin/astro.mjs …` directly because a folder name containing `&` (e.g. `Malmö Bygg & Riv AB`) breaks npm's `.cmd` shims. Don't use `npx astro …` in such a folder.

Copy `.env.example` to `.env` and fill in what you need (see sections 6–8). `.env` is git-ignored – never commit it.

## 2. Project structure

```
src/
  config/company.ts      ← ALL company facts (empty values are hidden on the site)
  config/site.ts         ← form + analytics settings (read from env)
  i18n/sv.json, en.json  ← all page copy (en.json must mirror sv.json – TypeScript enforces it)
  i18n/routes.ts         ← every URL in both languages (change slugs here)
  content/projects/      ← one Markdown file per project (both languages inside)
  content/news/sv|en/    ← news posts, one file per language
  content/jobs/sv|en/    ← job posts, one file per language
  assets/placeholders/   ← generated placeholder images
  assets/stock/          ← Pexels photos (override placeholders with the same file name)
  data/photo-credits.json← photographer credits written by `npm run photos`
  components/            ← UI components (see list below)
  views/                 ← one view per page type
  pages/[...slug].astro  ← builds every page in both languages from routes.ts
scripts/                 ← placeholder generator, Pexels fetcher
```

Reusable components: `Section`, `Container`, `SectionHeader`, `Button`, `Icon`, `Photo`, `Text` (highlights `[placeholders]`), `RoutingTile`, `ServiceCard`, `ProcessTimeline`, `PromiseBadge`, `StatFigure`, `ProjectCard`, `ProjectFilter`, `BeforeAfterSlider`, `FactsBox`, `Gallery`, `TeamCard`, `FAQAccordion`, `MultiStepForm`, `ApplicationForm`, `InstagramGrid`, `CTABand`, `PageHero`, `Breadcrumbs`, `Header`, `Footer`, `MobileActionBar`, `ConsentBanner`, `JsonLd`, form fields in `components/form/` (`Field`, `ChoiceGroup`, `Consent`, `Honeypot`).

Client JavaScript is limited to: mobile menu, project filter, before/after slider, multi-step form, application form, and the consent banner (only when analytics are enabled). The FAQ uses native `<details>`, so it needs no JavaScript.

## 3. Editing company information

Open **`src/config/company.ts`**. Empty values (`''`, `[]` or `null`) are hidden on the site together with the section or button that needs them – see section 11.

- Values shown in both languages use `{ sv: '…', en: '…' }`.
- `OPENING_HOURS_SCHEMA` (e.g. `['Mo-Fr 07:00-16:00']`) and `GEO` feed the JSON-LD; they are left empty until real values exist.
- `CERTIFICATIONS`, `KEY_FIGURES`, `TEAM`, `EQUIPMENT`, `PROMISES` are plain arrays – add, remove or reorder items.
- **Never enter numbers, certifications, clients, testimonials or people that are not real.**

Copy text (headings, service descriptions, FAQs, legal texts) lives in `src/i18n/sv.json` and `src/i18n/en.json`. Service-page FAQ answers on permits, ROT, asbestos/PCB and waste sorting are written as general guidance. Have them checked before launch, because rules change.

## 4. Adding content

### Projects – `src/content/projects/<slug>.md`

The file name becomes the URL (`/projekt/<slug>/` and `/en/projects/<slug>/`). The first published project makes the projects page, its menu link and the home and service-page project sections appear. Frontmatter:

```yaml
title: { sv: "…", en: "…" }
summary: { sv: "…", en: "…" }
description: { sv: "…", en: "…" }
location: "Malmö"
year: 2026
category: rivning        # rivning | sanering | håltagning | nybyggnad | ombyggnad
client: "…"
contractType: { sv: "Totalentreprenad", en: "Design-build" }
scope: { sv: "…", en: "…" }
recycledPercent: "85"    # optional – only verified figures
cover: ../../assets/projects/my-project/cover.jpg
images: [ ../../assets/projects/my-project/1.jpg ]
beforeImage: ../../assets/projects/my-project/before.jpg   # optional
afterImage: ../../assets/projects/my-project/after.jpg     # optional
photographer: "Namn Efternamn"
featured: true           # shown first on the home page
example: false           # true shows the "Exempel" badge
draft: false             # true hides the project
```


### News – `src/content/news/sv/<slug>.md` (+ optional `en/<slug>.md`)

The first published post makes the news page and its menu link appear. Frontmatter: `title`, `description`, `date` (YYYY-MM-DD), optional `image`, `imageAlt`, `draft`. Write the article body in Markdown. If both files share a file name they are linked as translations; otherwise the language switcher points to the news list.

### Job posts – `src/content/jobs/sv/<slug>.md` (+ optional `en/<slug>.md`)

Frontmatter: `title`, `location`, `employment`, `deadline` (optional), `summary`, `draft`. Each job page includes an application form with the position preselected.

### Changing URLs

Edit `src/i18n/routes.ts`. Links, hreflang tags, the sitemap and the language switcher update automatically.

## 5. Images

How an image is resolved:

1. Config and views refer to `placeholders/<name>.jpg`.
2. If **`src/assets/stock/<name>.jpg`** exists, it is used instead.
3. Otherwise the labelled placeholder is shown.

**To use your own photos:** save them in `src/assets/stock/` with the slot's file name (e.g. `hero.jpg`, `service-rivning.jpg`, `team-1.jpg`). You can also point the paths in `company.ts` / content frontmatter at any file in `src/assets/`. Astro generates AVIF/WebP in several sizes automatically.

**Stock photos:** `npm run photos` fills the hero, service, environment, safety, about, careers and machinery slots from Pexels (the example-project and news photos were removed together with the example content). Photographer names are saved in `src/data/photo-credits.json` but not shown on the site. Pexels photos are free to use; attribution is appreciated, not required. Replace them with your own site photos as soon as you can, because real projects build far more trust than stock.

**Not filled with stock:** team portraits and the Instagram grid must show your real people and feed, so those sections stay hidden until `TEAM` / `INSTAGRAM_*` are set. The default share image (Open Graph) is the hero photo.

**Hero video:** put an MP4 in `public/video/` and set `HERO_VIDEO_SRC = '/video/hero.mp4'`. It plays muted on loop with the hero image as poster, and autoplay is disabled for users who prefer reduced motion.

## 6. Forms

There are two forms: the five-step **quote request** on `/kontakt/` and the **job application** on `/karriar/` and on each job page.

- **Netlify Forms (default):** `PUBLIC_FORM_PROVIDER=netlify`. Netlify detects the forms in the static HTML (`data-netlify="true"`, honeypot `bot-field`). Submissions appear in the Netlify dashboard as `offertforfragan` and `jobbansokan`; set up email notifications there. Netlify caps a submission at about 8 MB, which is why the form allows at most 5 files and 8 MB in total (`src/config/site.ts`).
- **Formspree / own endpoint:** `PUBLIC_FORM_PROVIDER=formspree` and `PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxx`. Check that your plan supports file uploads.
- With JavaScript: the form validates each step, shows an error summary linked to each field, and saves progress in `sessionStorage` (restored after a reload; files are not saved). It then posts via `fetch` and shows a success screen with the expected response time (`RESPONSE_TIME`), or an error with your email (and phone, when set) as fallback.
- Without JavaScript: all steps show on one page and the form posts normally. Netlify then redirects to `/kontakt/tack/` (or `/karriar/tack/`).
- Links like `/kontakt/?tjanst=rivning#offert` preselect a service, and `?roll=<job title>` preselects a position.

## 7. Analytics, cookies and privacy

By default there are **no cookies, no tracking and no banner**. To enable privacy-friendly analytics:

```
PUBLIC_ANALYTICS_PROVIDER=plausible
PUBLIC_ANALYTICS_DOMAIN=dittforetag.se
```

A consent banner then appears, and the script loads only after the visitor accepts. The Cookies page explains the choice and offers a "Change my choice" button.

The legal pages (`/integritetspolicy/`, `/cookies/`, `/tillganglighet/`) contain no placeholders but are general texts. Have them reviewed before launch.

## 8. SEO

- Set `PUBLIC_SITE_URL` (e.g. `https://www.dittforetag.se`). It is used for canonical URLs, hreflang (sv/en/x-default), Open Graph and the sitemap.
- Every page has its own title and description in both languages. Service pages use local terms such as "Rivning i Malmö och Skåne" and "Asbestsanering och PCB-sanering i Skåne".
- JSON-LD:
  - `Organization` + `GeneralContractor` with address, area served, phone and opening hours on every page
  - `Service` + `FAQPage` + `BreadcrumbList` on service pages
  - `NewsArticle` on news posts
- `sitemap-index.xml` (thank-you pages excluded) and `robots.txt` are generated at build time.

## 9. Deploy

**Netlify (recommended – required for Netlify Forms):** connect the repo. `netlify.toml` already sets `npm run build`, publish dir `dist`, Node 24 and cache headers. Add `PUBLIC_SITE_URL` (and any other variables) under *Site settings → Environment variables*.

**Vercel:** import the repo. `vercel.json` sets the build command and output directory. Set the Node.js version to 24 in project settings. Netlify Forms do not work on Vercel, so use `PUBLIC_FORM_PROVIDER=formspree`.

Any other static host works too: upload the `dist/` folder.

## 10. Which Mobbin patterns inspired what

Researched with the Mobbin library before design. Links open on Mobbin (login required).

| Component / area | Pattern used | Mobbin reference |
| --- | --- | --- |
| Header utility bar + hero (full-bleed photo, condensed uppercase headline, solid + outline CTA, filled CTA in header) | YLLW | [YLLW hero](https://mobbin.com/sites/sections/20db4fde-5843-481a-9907-f12cd851e211) |
| Visitor routing tiles ("Ska du riva?" …) – bold question + arrow block | Ditto audience blocks, Maze "For …" cards | [Ditto](https://mobbin.com/sites/sections/d7d6419e-1e6f-490f-a59b-56dfc94a6d0c), [Maze](https://mobbin.com/sites/sections/0f2d1d3a-7a0c-4945-9400-0913cc165adc) |
| "Hela kedjan" process (horizontal rail, mono STEG labels; vertical on mobile) | Zaro, Samara | [Zaro](https://mobbin.com/sites/sections/8c5f87b3-8ee0-4662-857f-ab40416365c1), [Samara](https://mobbin.com/sites/sections/001f0854-a5f2-42e5-b54f-349fdf95799a) |
| Trust promises strip | Podia trust statements | [Podia](https://mobbin.com/sites/sections/ce0a096d-40c3-4302-b580-c2cac12dbe08) |
| Key figures (left rule, big numerals on dark band) | monday.com, Revolut | [monday.com](https://mobbin.com/sites/sections/5077309b-4b84-4d7d-b563-26fd60698bb0), [Revolut](https://mobbin.com/sites/sections/b5d03099-8332-47e5-bd72-ed80d0d9756b) |
| Project filter (pills with counts + year dropdown) | Unseen Studio, Canva | [Unseen Studio](https://mobbin.com/sites/sections/79d328bc-800b-4830-9de1-7ef8fd2dd00f), [Canva](https://mobbin.com/sites/sections/08893f77-ab16-4e86-84df-c3aea8d5824e) |
| Multi-step quote form – labelled stepper, "Steg 2 av 5", Back/Next bar, autosave note, review step | HubSpot "Creating a quote" | [HubSpot flow](https://mobbin.com/flows/34b4554c-ec7f-492b-bce5-81e5ec42f48d) |
| Form steps – one topic per step, segmented progress bars, large option cards, completion screen | Laravel Cloud survey | [Laravel Cloud flow](https://mobbin.com/flows/50d44602-9183-47a6-8e5f-91782acd2840) |
| Form with side panel, "Save & continue" | Upwork, HoneyBook lead form | [Upwork flow](https://mobbin.com/flows/b26dfe6c-337e-42f7-990d-0c7fa392c296), [HoneyBook flow](https://mobbin.com/flows/a8dee169-f7ef-4943-8327-ed5790e3666d) |
| Photo/drawing upload dropzone | WeTransfer | [WeTransfer](https://mobbin.com/screens/0a2975be-f594-447a-a42e-48ad295a3521) |
| FAQ accordion (heading left, accordion right, +/× toggle) | Origin, monday.com | [Origin](https://mobbin.com/sites/sections/1f1caf97-2f02-4668-bc84-05c7f760d6d2), [monday.com](https://mobbin.com/sites/sections/3f750e1f-9291-4fd7-a27d-331f750a57ac) |
| Contact details (contact / hours / find us), address block + "Google Maps" button | Monte, Homerun, Rains | [Monte](https://mobbin.com/sites/sections/6ecba422-fe26-482b-8225-8e24ec959d84), [Homerun](https://mobbin.com/sites/sections/b963530a-ad6d-4929-8cd0-09dc4d7a744f), [Rains](https://mobbin.com/sites/sections/82ce6566-c33e-4b16-8750-670aa04be011) |
| Team cards with direct contact | Analogue Agency, Height | [Analogue Agency](https://mobbin.com/sites/sections/a28617d5-8782-49f1-ad03-b7e91183524f), [Height](https://mobbin.com/sites/sections/c317bfca-01f4-4e4a-ade4-0109d694b919) |
| Open positions list (row, meta columns, arrow) | Tines, Runway | [Tines](https://mobbin.com/sites/sections/930c8997-584e-424d-9ee6-645f7232ebe3), [Runway](https://mobbin.com/sites/sections/9b88baff-1fc3-4850-b9e6-6bc4c0ed630b) |
| Careers hero / CTA band (condensed headline + photo/action) | Zipline | [Zipline careers](https://mobbin.com/sites/sections/7ad4aa10-a2e2-4aa9-9249-cda583d7632e), [Zipline CTA](https://mobbin.com/sites/sections/db606a06-580c-4a2a-b326-96df0ce8b3e1) |
| Sticky mobile action bar ("Ring oss" + "Begär offert") | Swiggy dual CTA, talabat call button, Insight Timer sticky bar | [Swiggy](https://mobbin.com/screens/6aad825c-41ac-481b-b06a-c1b95962dccf), [talabat](https://mobbin.com/screens/bc9e41ac-4a16-447d-9604-3f21982162b1), [Insight Timer](https://mobbin.com/screens/db9c5cc7-72a5-43c4-b67f-5e61ed036a18) |
| Footer (oversized wordmark, legal identity line, link columns, "no cookies" note) | Zellerfeld, Rains, Bevel, Steep | [Zellerfeld](https://mobbin.com/sites/sections/18df6730-6569-49da-9c23-3bee32fbe638), [Bevel](https://mobbin.com/sites/sections/5caa81d7-422e-41c2-93b1-d78676d665a0), [Steep](https://mobbin.com/sites/sections/5352176e-b2bd-46f1-b0f3-6de8bee4058b) |

## 11. Optional values – fill in to show

The site contains no placeholders. Anything without a real value is left out, together with the section, row or button that needs it. Fill a value in `src/config/company.ts` and it appears automatically:

| Value | Appears when filled in |
| --- | --- |
| `PHONE` | Phone in header, mobile menu, footer and contact page; "Ring oss" buttons (until then they read "Mejla oss"); tel: links; JSON-LD `telephone`; "Brådskande? Ring …" after the quote form |
| `OPENING_HOURS` (+ `OPENING_HOURS_SCHEMA`) | Opening hours in mobile menu, footer and contact page; JSON-LD `openingHours` |
| `RESPONSE_TIME` | "Vi svarar normalt …" on the quote success screen and thank-you page |
| `FOUNDED_YEAR` | Year on the About page; JSON-LD `foundingDate` |
| `INSTAGRAM_URL`, `LINKEDIN_URL`, `FACEBOOK_URL` | Social icons in the footer; JSON-LD `sameAs` |
| `INSTAGRAM_URL` + `INSTAGRAM_IMAGES` + `INSTAGRAM_HANDLE` | Instagram grid on the home page |
| `MAP_IMAGE` | Static map image on the contact page (the Google Maps link is always shown) |
| `CERTIFICATIONS`, `INSURANCE` | "Certifieringar och försäkring" section on Miljö & säkerhet |
| `KEY_FIGURES` | Key-figures strip on the home page (replaces the "Vi jobbar för" strip) |
| `TEAM` | Team section on Om oss and contact person on the contact page |
| `EQUIPMENT` | Machinery section on Om oss |
| `GEO` | JSON-LD coordinates |

**Content:** the projects and news pages (and their menu links) only exist once there is at least one published file in `src/content/projects/` or `src/content/news/`. With no job posts, the careers page shows "Inga lediga tjänster just nu" and the open application form.

**Check before launch:** `F_TAX_TEXT` ("Godkänd för F-skatt" in the footer) – keep it only if it is true. `SEAT` (Malmö) and `SERVICE_AREA` (Malmö och Skåne) – adjust if needed. The legal pages are written without placeholders but should still be reviewed by someone who knows your setup (for example which email provider you use).

**Environment variables:** `PUBLIC_SITE_URL`, `PUBLIC_FORM_PROVIDER` / `PUBLIC_FORM_ENDPOINT`, and optionally `PUBLIC_ANALYTICS_*`.
