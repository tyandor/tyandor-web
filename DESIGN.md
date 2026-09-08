# DESIGN.md

Design standards for [tyandor.com](https://tyandor.com).

The colour, type, spacing, motion and elevation systems are **not defined here**.
They come from [`@tyandor/tokens`](https://design.tyandor.com), and that site is
the reference: every role, both themes, with live swatches and contrast figures.
This file covers only what is specific to this site — the shell, the content
patterns, the animation rules and the branding.

If you are looking for a hex value, you are looking in the wrong file. That is
the point of the split: values live in one place so the terminal themes, the
editor themes and this site cannot drift apart.

---

## The token contract

Two imports in `app/layout.tsx` supply everything:

```ts
import '@tyandor/tokens/tokens.css'   // --ty-* roles, both themes
import { fontVariables } from '@tyandor/fonts/next'
```

`tailwind.config.js` extends the token preset, so roles are reachable as
ordinary utilities: `bg-background`, `text-text-primary`, `border-border-subtle`,
`text-link`, `bg-interactive`.

### Roles this site actually uses

| Utility | Role | Used for |
|---|---|---|
| `bg-background` | page ground | `<body>` |
| `bg-layer-01` | first raised surface | the main content card, article cards |
| `bg-layer-02` | second raised surface | nav, footer, tag chips, modal panels |
| `bg-layer-hover` | hover fill | chip and row hover |
| `text-text-primary` | body copy | prose, card body |
| `text-text-secondary` | captions, metadata | nav links, dates, quadrant labels |
| `text-text-emphasis` | headings | page heroes, card titles, section names |
| `text-text-placeholder` | lowest-contrast text | the `§` divider, de-emphasised notes |
| `text-link` / `border-link` | links | inline links, category chips |
| `bg-interactive` | primary action fill | buttons, the skip link, the logo mark |
| `text-text-on-color` | label on a filled colour | button text, chart labels on ring fills |
| `border-border-subtle` | dividers, card outlines | most borders |
| `--ty-chart-01…04` | chart series | the technology radar |

**Never hardcode a hex, an `rgb()` or a Tailwind palette colour** (`text-gray-500`,
`bg-blue-600`). If no role fits, that is a signal the token package is missing
one — raise it upstream rather than inventing a local value. Two places still
break this rule; see *Known gaps*.

---

## Theming

`next-themes` writes **one class** on `<html>`, and the token contract reads it:

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem
  value={{ light: 'ty-theme-earth', dark: 'ty-theme-mcrn' }}>
```

Three things about this are load-bearing:

- The theme **names** stay `light` / `dark`. That is what `enableSystem` resolves
  a system preference to; rename them and system mode silently stops matching.
- `tailwind.config.js` sets `darkMode: ['selector', '.ty-theme-mcrn']`, so a
  `dark:` variant keys off the same class the tokens read. One source of truth.
- **You almost never need a `dark:` variant.** The role tokens already carry both
  themes. `text-text-primary` is correct in MCRN and Earth. Writing
  `text-text-primary dark:text-text-primary` is noise; writing a *different* role
  under `dark:` usually means the wrong role was picked in the first place.

Earth is the light theme, MCRN the dark one. The default is `system`.

---

## Typography

| Role | Family | Source |
|---|---|---|
| Body | **iA Writer Duo** | `@tyandor/fonts/next`, `font-body` |
| Mono | **iA Writer Mono** | `@tyandor/fonts/next`, `font-mono` |
| Serif | system serif | `font-serif`, blockquote attributions only |

Loaded through `next/font/local` from the fonts package, which self-hosts
subsetted woff2 and returns the CSS variables as `fontVariables`.

| Context | Class |
|---|---|
| Page hero | `text-7xl font-bold font-mono text-text-emphasis` |
| Article hero | `text-5xl md:text-8xl font-bold font-mono` |
| Section heading | `text-2xl font-bold font-mono` (lowercase: `articles`, `tools`) |
| Card title | `text-lg font-bold font-mono` |
| Body | `text-sm` / `text-base` |
| Pull quote | `text-4xl italic font-bold font-serif` |

---

## Layout

```
┌────────────────────────────────────────┐
│  header   bg-layer-02                  │
├────────────────────────────────────────┤
│  main     bg-layer-01                  │
│           container, px-2 sm:px-4 md:px-8
│           border-radius: 5rem (inline) │
├────────────────────────────────────────┤
│  footer   bg-layer-02                  │
└────────────────────────────────────────┘
```

The body ground is `bg-background`; the main card sits on it as a large pill with
an inline `border-radius: 5rem`. That radius is deliberately not a token — it is
a one-off shape, not a scale step.

**Breakpoints are Carbon's**, via the preset: `sm` 20rem, `md` 42rem, `lg` 66rem,
`xlg` 82rem, `max` 99rem. Note `sm` is 320px, not Tailwind's 640px — an `sm:`
utility applies at essentially every width. Reach for `md:` when you mean
"tablet and up".

| Tier | Class | Use |
|---|---|---|
| Narrow prose | `max-w-4xl` | article body |
| Medium grid | `max-w-6xl` | tools, designs |
| Full | `max-w-7xl` | quote features |

---

## Components

### Article card
`bg-layer-01`, `border border-border-subtle`, `rounded-lg`, `p-4 md:p-8`,
`hover:shadow-lg transition-shadow`.

### Category chip — reads as a link, because it is one
```
bg-layer-01 border border-link text-link rounded-md
hover:bg-link hover:text-text-on-color
```

### Tag chip — metadata, one step quieter
```
bg-layer-02 text-text-secondary border border-border-subtle rounded-full
hover:bg-layer-hover hover:text-text-primary
```
Prefixed with `#`. The weight difference between the two chips is intentional:
categories are navigation, tags are annotation.

### Radius
`rounded-lg` / `md` / `sm` resolve through `--radius` (0.5rem), declared in
`app/globals.css`. The token package has no radius scale yet; if one lands
upstream, that declaration becomes an alias.

---

## Animations

GSAP with `ScrollTrigger`, registered per component in `useEffect`.

```js
fromTo(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
scrollTrigger: { start: 'top bottom-=100', toggleActions: 'play none none reverse' }
```

- Animated components are `dynamic(() => import(...), { ssr: false })`.
- Never call GSAP outside a `useEffect`.
- `power3.out` is the standard ease. 0.8s standard, 1s for large elements.
- Durations and easings that need to match the rest of the system use the motion
  tokens: `duration-fast-02`, `ease-standard-productive`.

The home page gates its content behind a GSAP loading overlay. In any headless or
hidden-pane environment `requestAnimationFrame` does not fire, so the overlay
never clears and the page looks empty. That is the harness, not the site — drive
`gsap.ticker.tick()` by hand to verify.

---

## Branding

- **Mark**: `∧∨`, used in `<title>` and the footer. SVG at `/public/tyandor-logo.svg`.
- **Section headings**: lowercase mono in `text-text-emphasis`.
- **Divider glyph**: `§` (`&sect;`) beneath article titles, `text-text-placeholder`.
- **Icons**: Lucide React only. Do not add another icon library.

---

## Prose

`@tailwindcss/typography` with the `prose` class. Its ramp is remapped onto role
tokens in `app/globals.css` by setting `--tw-prose-*` rather than writing
`.prose p` rules — the plugin resolves every element through those variables, so
one block reaches list markers, table borders and captions without fighting the
`:where()` selectors it ships.

`prose-invert` is pointed at the same variables. The token layer already swaps per
theme, so a second ramp would just be something else that can disagree.

`max-w-none` on the prose container; the parent `max-w-4xl` handles width.

---

## Accessibility

- Skip link: `sr-only focus:not-sr-only`, `bg-interactive text-text-on-accent`.
- Focus: one global `*:focus-visible` outline at `2px solid var(--ty-focus)`.
  Do not add component-level focus rings in another colour.
- Nav carries `role="navigation"`; the mobile toggle carries `aria-expanded`.
- Every role pairing in the token package is contrast-gated upstream. That gate
  does not know about pairings invented here, so if you put text on an unusual
  ground, check it.

---

## Known gaps

Three things are deliberately unfinished rather than quietly wrong:

1. **No radius scale upstream.** `--radius` is declared in `app/globals.css`
   because `@tyandor/tokens` has no radius tokens. If a scale lands upstream,
   that declaration becomes an alias.
2. **No tinted support surfaces.** Every `support-*` role is `kind: "text"`, so a
   warning or error callout has no coloured background to sit on. The callouts in
   `app/setup-integrations/page.tsx` use `bg-layer-02` with a `border-support-*`
   left rule instead, which works but is a workaround for a missing role.
3. **`support-warning` is not AA at body size in Earth.** It measures 3.55:1 on
   `layer-02`, so it is usable for borders, icons and large text but not 14px
   copy. That is why the warning callout's body is `text-text-primary` while the
   error callout's is `text-support-error` (5.44:1 Earth, 6.38:1 MCRN).

Separately, `components/ui/sidebar.tsx` references `--sidebar-*` variables that
nothing declares. It is not imported anywhere, so it renders nowhere — delete it
or wire it up before using it.

---

## What not to do

- Do not hardcode a hex, `rgb()`, or Tailwind palette colour. Use a role.
- Do not add a `dark:` variant that names a different role — the tokens already
  theme themselves.
- Do not add font families. Duo + Mono is the stack.
- Do not call GSAP outside `useEffect`, or in an SSR component.
- Do not reintroduce a second palette. One contract, one source of truth.
- Do not use `npm`. The runtime is Bun.
