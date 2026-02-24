import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import Script from 'next/script'
import { ThemeProvider } from './components/ThemeProvider'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen bg-rosePine-overlay text-rosePine-text`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navigation />
          <main id="main-content" className="flex-grow container mx-auto mt-2 mb-10 px-2 sm:px-4 md:px-8 py-12 shadow-2xl rounded-2xl bg-rosePine-base" style={{ borderRadius: "5rem" }}>
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

