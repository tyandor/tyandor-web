import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import Image from 'next/image';
import Link from 'next/link'
import Script from 'next/script'
import { ThemeProvider } from './components/ThemeProvider'
import { ThemeToggle } from './components/ThemeToggle'
import Logo from '../public/tyandor-logo.svg';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen bg-rosePine-overlay text-rosePine-text`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="bg-rosePine-overlay dark:text-rosePine-text">
            <nav className="container mx-auto px-4 py-6">
              <div className="flex justify-between items-center">
                <Link href="/" className="text-3xl font-bold text-rosePine-love hover:text-rosePine-gold transition-colors">
                  <Image src={Logo} width={100} alt="logo for tyandor.com" />
                </Link>
                <ul className="flex space-x-6 items-center">
                  <li><Link href="/" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Home</Link></li>
                  <li><Link href="/about" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">About</Link></li>
                  <li><Link href="/quotes" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Quotes</Link></li>
                  <li><Link href="/articles" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Articles</Link></li>
                  <li><Link href="/ideas" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Ideas</Link></li>
                  <li><Link href="/projects" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Projects</Link></li>
                  <li><Link href="/tools" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Tools</Link></li>
                  <li><Link href="/designs" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Designs</Link></li>
                  <li><Link href="/books" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Books</Link></li>
                  <li><ThemeToggle /></li>
                </ul>
              </div>
            </nav>
          </header>
          <main className="flex-grow container mx-auto mt-2 mb-10 px-4 md:px-8 py-12 shadow-2xl rounded-2xl bg-rosePine-base" style={{borderRadius:"7rem"}}>
            {children}
          </main>
          <footer className="bg-rosePine-overlay text-rosePine-text dark:text-rosePine-text mt-12 py-12">
            <div className="flex container justify-center mx-auto py-8">
              <Link href="/" className="p-8">
                <Image src={Logo} width={100} alt="logo for tyandor.com" />
              </Link>
            </div>
            <div className="container mx-auto px-4 text-center">
              <p>&and;&or; &copy; {new Date().getFullYear()} Tyler Andor. All rights reserved.</p>
            </div>
          </footer>
        </ThemeProvider>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollTrigger.min.js" />
      </body>
    </html>
  )
}

