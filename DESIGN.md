# DESIGN.md

Design standards for [tyandor.com](https://tyandor.com).

---

## Color System: Rosé Pine

The site uses the [Rosé Pine](https://rosepinetheme.com/) color palette exclusively. Three variants are active:

- **Default / `:root`** — Rosé Pine Dawn (warm light theme)
- **`.dark`** — Rosé Pine Moon (purple dark theme)
- **`.light`** — Rosé Pine Dawn (same as `:root`, explicit override)

### Rosé Pine Dawn (light mode)

| Token             | CSS Variable                  | RGB               | Hex       | Role                                 |
|-------------------|-------------------------------|-------------------|-----------|--------------------------------------|
| `base`            | `--color-base`                | 250 244 237       | `#FAF4ED` | Page background                      |
| `surface`         | `--color-surface`             | 255 250 243       | `#FFFAF3` | Card / elevated surface              |
| `overlay`         | `--color-overlay`             | 242 233 225       | `#F2E9E1` | Nav, footer, sunken layer            |
| `muted`           | `--color-muted`               | 152 147 165       | `#988BA2` | De-emphasised text, placeholders     |
| `subtle`          | `--color-subtle`              | 121 117 147       | `#797593` | Secondary text, quote attributions   |
| `text`            | `--color-text`                | 87 82 121         | `#575279` | Body text                            |
| `love`            | `--color-love`                | 180 99 122        | `#B4637A` | Logo, primary accent, focus rings    |
| `gold`            | `--color-gold`                | 234 157 52        | `#EA9D34` | Hover on logo, highlighted items     |
| `rose`            | `--color-rose`                | 215 130 126       | `#D7827E` | Section headings (`articles`, etc.)  |
| `pine`            | `--color-pine`                | 40 105 131        | `#286083` | Link hover states                    |
| `foam`            | `--color-foam`                | 86 148 159        | `#56949F` | Category pill border & text          |
| `iris`            | `--color-iris`                | 144 122 169       | `#907AA9` | Available for accent use             |
| `highlight-low`   | `--color-highlight-low`       | 244 237 232       | `#F4EDE8` | Card borders, subtle dividers        |
| `highlight-med`   | `--color-highlight-med`       | 223 218 217       | `#DFDAD9` | Hover backgrounds                    |
| `highlight-high`  | `--color-highlight-high`      | 206 202 205       | `#CECACD` | Active / selected states             |

### Rosé Pine Moon (dark mode, `.dark`)

| Token             | RGB               | Hex       |
|-------------------|-------------------|-----------|
| `base`            | 35 33 54          | `#232136` |
| `surface`         | 42 39 63          | `#2A273F` |
| `overlay`         | 57 53 82          | `#393552` |
| `muted`           | 110 106 134       | `#6E6A86` |
| `subtle`          | 144 140 170       | `#908CAA` |
| `text`            | 224 222 244       | `#E0DEF4` |
| `love`            | 235 111 146       | `#EB6F92` |
| `gold`            | 246 193 119       | `#F6C177` |
| `rose`            | 234 154 151       | `#EA9A97` |
| `pine`            | 62 143 176        | `#3E8FB0` |
| `foam`            | 156 207 216       | `#9CCFD8` |
| `iris`            | 196 167 231       | `#C4A7E7` |
| `highlight-low`   | 42 40 62          | `#2A283E` |
| `highlight-med`   | 68 65 90          | `#44415A` |
| `highlight-high`  | 86 82 110         | `#56526E` |

### Tailwind Usage

Colors are referenced via the `rosePine-*` and `rosePineMoon-*` prefixes in Tailwind classes. The `rosePineDawn` alias maps to the same CSS variables and is used in dark-mode variants (`:dark:text-rosePineDawn-*`).

```
text-rosePine-text        text-rosePineMoon-text
bg-rosePine-surface       bg-rosePineMoon-surface
border-rosePine-foam      border-rosePineMoon-foam
hover:text-rosePine-rose  dark:hover:text-rosePineMoon-rose
```

### Chart Colors

Four accent values for data visualisation:

| Swatch | Hex       |
|--------|-----------|
| 1      | `#EBBCBA` |
| 2      | `#EA9A97` |
| 3      | `#D7827E` |
| 4      | `#B4637A` |

All four sit within the rose/love range of the palette for a cohesive radar chart.

---

## Typography

### Fonts

| Role        | Family         | Loading                          |
|-------------|----------------|----------------------------------|
| Primary     | **Inter**      | `next/font/google` (latin subset) |
| Headings    | `font-mono`    | System monospace stack           |
| Prose body  | `font-sans`    | System sans-serif stack          |
| Blockquotes | `font-serif`   | System serif stack               |

Inter is loaded via `next/font` and applied to the `<body>` via the `inter.className` on `<body>`. The default `body` declaration in `globals.css` references `Arial, Helvetica, sans-serif` as a fallback — Inter takes precedence when loaded.

### Scale & Usage

| Context                       | Class                                    |
|-------------------------------|------------------------------------------|
| Article hero title            | `text-5xl md:text-8xl font-bold font-mono` |
| Section headings (home)       | `text-2xl font-bold font-mono`           |
| Card titles                   | `text-lg font-bold font-mono`            |
| Body / card description       | `text-sm` / `text-base` (default)        |
| Blockquote pull quote         | `text-4xl italic font-bold font-serif`   |
| Quote attribution             | `text-sm font-sans text-right`           |
| Published date                | `text-gray-500 font-serif`              |
| Category / tag badges         | `text-sm` (categories), `text-xs` (tags) |

Prose content inside `<article>` uses the `prose` class from `@tailwindcss/typography`, scoped to Rosé Pine text color.

---

## Layout

### Page Shell

```
┌──────────────────────────────────────────┐
│  header  (bg-rosePine-overlay)           │
├──────────────────────────────────────────┤
│  main                                    │
│  (container mx-auto, px 2/4/8)          │
│  (bg-rosePine-base, border-radius: 5rem) │
│  (shadow-2xl, rounded-2xl)              │
├──────────────────────────────────────────┤
│  footer  (bg-rosePine-overlay)           │
└──────────────────────────────────────────┘
```

- The outer body is `bg-rosePine-overlay` (the warm overlay tone), creating a visible contrast frame around the main card.
- The main content card has an aggressive `border-radius: 5rem` (hardcoded inline), making it a large pill shape.
- Container max-width is standard Next.js `container` with responsive horizontal padding (`px-2 sm:px-4 md:px-8`).
- Content has `mt-2 mb-10 py-12` vertical spacing in the shell, `mt-14` inside individual article pages.

### Content Width Tiers

| Tier          | Class         | Use                              |
|---------------|---------------|----------------------------------|
| Narrow prose  | `max-w-4xl`   | Article body, articles list      |
| Medium grid   | `max-w-6xl`   | Tools, designs grids             |
| Full content  | `max-w-7xl`   | Quote feature, wide layouts      |

### Grid Patterns

- Articles list: `grid grid-cols-1 gap-4`
- Tools on home: `grid gap-6 md:grid-cols-2`
- Designs on home: `grid gap-6 md:grid-cols-3`
- Categories/tags in `CategoryTagDisplay`: `grid grid-cols-1 md:grid-cols-2 gap-8`

---

## Cards & Surfaces

### Article Cards

- Background: `bg-rosePine-surface dark:bg-rosePineMoon-surface`
- Border: `border border-rosePine-highlightLow dark:border-rosePineMoon-highlightLow`
- Border radius: `rounded-lg`
- Padding: `p-4 md:p-8`
- Hover: `hover:shadow-lg transition-shadow`

### Category Pill (foam-tinted)

```
bg-rosePine-surface border-rosePine-foam text-rosePine-foam
hover: bg-rosePine-foam text-rosePine-base
```
Shape: `rounded-md`, size: `text-sm px-2 py-1`.

### Tag Pill (rose-tinted)

```
bg-rosePine-rose/10 text-rosePine-rose border-rosePine-rose/20
hover: bg-rosePine-rose text-rosePine-base
```
Shape: `rounded-full`, size: `text-xs px-2 py-1`. Tags are prefixed with `#`.

### `CategoryTagDisplay` Container

Background `bg-rosePine-overlay`, border `border-rosePine-surface`, `rounded-lg`, inner section separator uses `border-dotted border-rosePine-subtle/40`.

---

## Navigation

- Header background: `bg-rosePine-overlay`
- Logo: SVG mark (`/public/tyandor-logo.svg`), width 100px, links to `/`
- Nav links (desktop): `text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine`
- Breakpoint: desktop nav visible at `lg:` (1024px+), mobile hamburger below
- Mobile menu: GSAP-animated expand/collapse (`height: 0 → auto`, `opacity: 0 → 1`, 300ms)
- Hamburger: 3 bars → X via GSAP rotate+translate (300ms timeline)
- Theme toggle: sun/moon icon swap (Lucide), `hover:bg-rosePine-highlightLow`

---

## Animations

All scroll-triggered animations use **GSAP 3.11.4** loaded from CDN. The `ScrollTrigger` plugin is registered in each component's `useEffect`.

### Standard Entrance Animation

Most `Animated*` cards use:
```js
fromTo(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
scrollTrigger: { start: 'top bottom-=100', toggleActions: 'play none none reverse' }
```

### Article Detail Cards (full list page)

More dramatic entrance with 3D tilt:
```js
fromTo(el, { opacity: 0, y: 100, rotateX: 45 }, { opacity: 1, y: 0, rotateX: 0, duration: 1, ease: 'power3.out' })
```

### Quote Block

Starts `opacity-0` inline, animated in after the articles section scrolls past `bottom center`.

### Rules

- All animated components use `dynamic(() => import(...), { ssr: false })` — no SSR for GSAP components.
- Never apply GSAP outside a `useEffect`.
- Ease: `power3.out` is the standard; do not introduce new easing without justification.
- Animation duration: 0.8s standard, 1s for large/dramatic elements.

---

## Branding & Identity

- **Logo mark**: `∧∨` (logical AND / OR symbols) used in `<title>` and footer. SVG version in `/public/tyandor-logo.svg`.
- **Site name**: `∧∨` displayed in metadata, plain text `Tyler Andor` in prose contexts.
- **Section heading style**: lowercase `font-mono` in `text-rosePine-rose` (e.g., `articles`, `tools`, `design`).
- **Separator glyph**: `§` (section sign, `&sect;`) used as a visual divider beneath article titles.

---

## Iconography

Icons are sourced from **Lucide React** (`lucide-react`). Only use Lucide — do not introduce other icon libraries.

Examples in use:
- `SunIcon` — light mode indicator in theme toggle
- `MoonIcon` — dark mode indicator in theme toggle

---

## Dark / Light Mode

- Toggled via `next-themes` with `attribute="class"` strategy.
- Default: `system` (follows OS preference).
- The `ThemeProvider` wraps the entire app in `RootLayout`.
- Dark mode class is `.dark` on `<html>`.
- Always pair light and dark variants in component classes:
  ```
  text-rosePine-text dark:text-rosePineMoon-text
  bg-rosePine-surface dark:bg-rosePineMoon-surface
  ```

---

## Spacing & Radius

| Token     | Value             | Source                          |
|-----------|-------------------|---------------------------------|
| `--radius` | `0.5rem`         | Shadcn/ui default               |
| `rounded-lg` | `0.5rem`       | Standard card radius            |
| `rounded-md` | `calc(0.5rem - 2px)` | Category pill              |
| `rounded-full` | 9999px        | Tag pill                        |
| Main content card | `5rem`   | Inline style on `<main>`        |

---

## Prose / MDX Content

- Uses `@tailwindcss/typography` (`prose` class).
- Heading and inline elements (`h1`–`h5`, `a`, `blockquote`, `strong`, `em`) are forced to `rgb(var(--color-text) / 1)` via a `.prose` override in `globals.css`, overriding the default gray scale.
- `max-w-none` prevents the prose container from constraining the layout — the parent `max-w-4xl` handles width.
- GFM (GitHub Flavored Markdown) is enabled via `remarkGfm`.

---

## Accessibility

- Skip-to-content link: visually hidden, revealed on focus (`sr-only focus:not-sr-only`), styled `bg-rosePine-love text-rosePine-base`.
- Navigation uses `role="navigation"`, `role="menubar"`, `role="menuitem"`.
- Mobile toggle has `aria-label="Toggle mobile menu"` and `aria-expanded`.
- Shadcn/ui components are accessible by default — maintain this when customising them.
- Focus ring: `focus:ring-2 focus:ring-rosePine-love`.

---

## What Not to Do

- Do not use the shadcn/ui default gray-scale color tokens (`--background`, `--foreground`, etc.) for new UI — use `rosePine-*` tokens instead. The shadcn tokens remain for Shadcn component internals only.
- Do not add new font families. Inter + system mono/serif/sans is the full stack.
- Do not write GSAP animations outside a `useEffect`, and never in SSR-rendered components.
- Do not use `npm` — the runtime is Bun.
- Do not hardcode hex or RGB colors in component classes — always use the `rosePine-*` Tailwind tokens.
