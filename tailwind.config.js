/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rosePine: {
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
        },
        rosePineDawn: {
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
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

