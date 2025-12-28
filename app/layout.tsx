import './globals.css'
import { Metadata } from 'next'
import Script from 'next/script'
import { ThemeProvider } from './components/ThemeProvider'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { createClient } from '@/lib/supabase/server'

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
  },
  icons: {
    shortcut: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-rosePine-overlay text-rosePine-text font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navigation user={user} />
          <main id="main-content" className="flex-grow container mx-auto mt-2 mb-10 px-2 sm:px-4 md:px-8 py-12 shadow-2xl rounded-2xl bg-rosePine-base" style={{borderRadius:"5rem"}}>
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

