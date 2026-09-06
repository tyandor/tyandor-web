// tokens.css first: globals.css and every shell class below resolve through
// the --ty-* properties it defines.
import '@tyandor/tokens/tokens.css'
import './globals.css'
import { fontVariables } from '@tyandor/fonts/next'
import { Metadata } from 'next'
import Script from 'next/script'
import { ThemeProvider } from './components/ThemeProvider'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'

export const metadata: Metadata = {
  title: {
    default: '∧∨',
    template: '%s | ∧∨'
  },
  description: 'The personal website of Tyler Andor',
  openGraph: {
    title: '∧∨',
    description: 'The personal website of Tyler Andor',
    url: 'https://tyandor.com',
    siteName: '∧∨',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://tyandor.com/og-image.png' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: '∧∨',
    card: 'summary_large_image',
    images: ['https://tyandor.com/og-image.png'],
  },
  icons: {
    shortcut: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`h-full ${fontVariables}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-background text-text-primary font-body">
        {/*
          next-themes writes one class, and both token systems read it: the
          --ty-* contract matches .ty-theme-* directly, and globals.css hangs
          the Rosé Pine --color-* values off the same two selectors.

          `value` maps the theme *names* to those classes. The names stay
          light/dark because that is what enableSystem resolves a system
          preference to — rename them and system mode silently stops matching.
        */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          value={{ light: 'ty-theme-earth', dark: 'ty-theme-mcrn' }}
        >
          <Navigation />
          <main id="main-content" className="flex-grow container mx-auto mt-2 mb-10 px-2 sm:px-4 md:px-8 py-12 shadow-2xl rounded-2xl bg-layer-01" style={{ borderRadius: "5rem" }}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollTrigger.min.js" />
      </body>
    </html>
  )
}

