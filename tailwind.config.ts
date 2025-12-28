import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "*.{js,ts,jsx,tsx,mdx}"
    ],
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
                },
                rosePineMoon: {
                    base: 'rgb(35 33 54 / <alpha-value>)',
                    surface: 'rgb(42 39 63 / <alpha-value>)',
                    overlay: 'rgb(57 53 82 / <alpha-value>)',
                    muted: 'rgb(110 106 134 / <alpha-value>)',
                    subtle: 'rgb(144 140 170 / <alpha-value>)',
                    text: 'rgb(224 222 244 / <alpha-value>)',
                    love: 'rgb(235 111 146 / <alpha-value>)',
                    gold: 'rgb(246 193 119 / <alpha-value>)',
                    rose: 'rgb(234 154 151 / <alpha-value>)',
                    pine: 'rgb(62 143 176 / <alpha-value>)',
                    foam: 'rgb(156 207 216 / <alpha-value>)',
                    iris: 'rgb(196 167 231 / <alpha-value>)',
                },
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            keyframes: {
                'accordion-down': {
                    from: {
                        height: '0'
                    },
                    to: {
                        height: 'var(--radix-accordion-content-height)'
                    }
                },
                'accordion-up': {
                    from: {
                        height: 'var(--radix-accordion-content-height)'
                    },
                    to: {
                        height: '0'
                    }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
