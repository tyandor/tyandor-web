/** @type {import('tailwindcss').Config} */
const tyandor = require('@tyandor/tokens/tailwind-preset')

// The preset ships the named accents as an object (accent.amber, accent.cyan…),
// while shadcn wants a single `accent` colour. Keep both: spread the palette and
// add a DEFAULT, so `bg-accent` is the UI role and `text-accent-amber` still
// reaches the expressive palette.
const { accent } = tyandor.theme.extend.colors

// shadcn's vocabulary, resolved to Expanse roles. components/ui/* names colours
// `foreground`, `card`, `ring` and so on. Those were declared only in
// tailwind.config.ts, which Tailwind never loaded — .js wins — so they resolved
// to nothing until Milestone 5 mapped them here.
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

  // Colours, spacing, type, breakpoints, motion and elevation all arrive through
  // the preset now. Rosé Pine's fifteen --color-* variables were retired in
  // Milestone 6; the only palette left here is shadcn's, and it is a translation
  // layer onto role tokens rather than a second set of values.
  theme: {
    extend: {
      colors: shadcn,

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },

  // tailwindcss-animate has been a dependency since the shadcn install but was
  // only ever registered in tailwind.config.ts, the file Tailwind never read —
  // so the 124 animation classes across components/ui/* have never run. shadcn
  // assumes it is present; registering it is what those components were written
  // against.
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
}
