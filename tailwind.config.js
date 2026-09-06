/** @type {import('tailwindcss').Config} */
const tyandor = require('@tyandor/tokens/tailwind-preset')
const defaultTheme = require('tailwindcss/defaultTheme')

// The preset ships the named accents as an object (accent.amber, accent.cyan…),
// while shadcn wants a single `accent` colour. Keep both: spread the palette and
// add a DEFAULT, so `bg-accent` is the UI role and `text-accent-amber` still
// reaches the expressive palette.
const { accent } = tyandor.theme.extend.colors

// Rosé Pine, still installed. Everything outside the shell still paints through
// these; Milestone 6 retires them. One object under two names because that is
// the truth of it — `rosePineDawn` was never a second theme, just a second name
// for the same variables, so `dark:text-rosePineDawn-text` never swapped
// anything. The variables themselves change under .ty-theme-*, in globals.css.
const rosePine = {
  base: 'rgb(var(--color-base) / <alpha-value>)',
  surface: 'rgb(var(--color-surface) / <alpha-value>)',
  overlay: 'rgb(var(--color-overlay) / <alpha-value>)',
  muted: 'rgb(var(--color-muted) / <alpha-value>)',
  subtle: 'rgb(var(--color-subtle) / <alpha-value>)',
  text: 'rgb(var(--color-text) / <alpha-value>)',
  love: 'rgb(var(--color-love) / <alpha-value>)',
  gold: 'rgb(var(--color-gold) / <alpha-value>)',
  rose: 'rgb(var(--color-rose) / <alpha-value>)',
  pine: 'rgb(var(--color-pine) / <alpha-value>)',
  foam: 'rgb(var(--color-foam) / <alpha-value>)',
  iris: 'rgb(var(--color-iris) / <alpha-value>)',
  highlightLow: 'rgb(var(--color-highlight-low) / <alpha-value>)',
  highlightMed: 'rgb(var(--color-highlight-med) / <alpha-value>)',
  highlightHigh: 'rgb(var(--color-highlight-high) / <alpha-value>)',
}

// shadcn's vocabulary, resolved to Expanse roles. components/ui/* names colours
// `foreground`, `card`, `ring` and so on. Those were declared only in
// tailwind.config.ts, which Tailwind never loaded — .js wins — so they have been
// resolving to nothing since the day they were added. Mapping them onto role
// tokens is what PLAN.md step 4 means by "shadcn components keep working on the
// new tokens".
//
// This is also why the mapping cannot wait for Milestone 6: the preset defines
// `background`, so adding it alone would paint `bg-background` near-black while
// `text-foreground` stayed unset. A half-styled dialog is worse than an
// unstyled one.
const role = (name) => `rgb(var(--ty-${name}-rgb) / <alpha-value>)`

const shadcn = {
  foreground: role('text-primary'),
  card: { DEFAULT: role('layer-01'), foreground: role('text-primary') },
  popover: { DEFAULT: role('layer-02'), foreground: role('text-primary') },
  primary: { DEFAULT: role('interactive'), foreground: role('text-on-accent') },
  secondary: { DEFAULT: role('layer-02'), foreground: role('text-primary') },
  muted: { DEFAULT: role('layer-02'), foreground: role('text-secondary') },
  accent: { ...accent, DEFAULT: role('layer-hover'), foreground: role('text-primary') },
  destructive: { DEFAULT: role('support-error'), foreground: role('text-on-color') },
  border: role('border-subtle'),
  input: role('field'),
  ring: role('focus'),
}

module.exports = {
  presets: [tyandor],

  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  // next-themes writes the token contract's own class names (see app/layout.tsx),
  // so `dark:` keys off the MCRN theme rather than a separate `.dark` marker.
  // One class, one source of truth — the alternative is a second attribute that
  // can silently disagree with the one the tokens actually read.
  darkMode: ['selector', '.ty-theme-mcrn'],

  theme: {
    extend: {
      // ── Milestone 5 hold ──────────────────────────────────────────────────
      // The preset moves sm/md/lg to Carbon's 20/42/66rem. That is the right end
      // state, but it retimes 94 responsive utilities across 22 routes, which is
      // a layout change and not a shell migration. Pin Tailwind's defaults until
      // Milestone 6 adopts the grid deliberately, then delete this block.
      screens: { ...defaultTheme.screens },

      colors: { rosePine, rosePineDawn: rosePine, ...shadcn },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },

  plugins: [require('@tailwindcss/typography')],
}
