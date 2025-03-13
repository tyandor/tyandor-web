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
      <body className={`${inter.className} flex flex-col min-h-screen bg-rosePine-base text-rosePine-text`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="mb-4">
            <nav className="container mx-auto px-4 py-6">
              <div className="flex justify-between items-center">
                <Link href="/" className="text-3xl font-bold text-rosePine-love hover:text-rosePine-gold transition-colors">
                  <Image src={Logo} width={70} alt="logo for tyandor.com" />
                </Link>
                <ul className="flex space-x-6 items-center">
                  <li><Link href="/" className="text-rosePine-text hover:text-rosePine-pine transition-colors">Home</Link></li>
                  <li><Link href="/about" className="text-rosePine-text hover:text-rosePine-pine transition-colors">About</Link></li>
                  <li><Link href="/quotes" className="text-rosePine-text hover:text-rosePine-pine transition-colors">Quotes</Link></li>
                  <li><Link href="/articles" className="text-rosePine-text hover:text-rosePine-pine transition-colors">Articles</Link></li>
                  <li><Link href="/ideas" className="text-rosePine-text hover:text-rosePine-pine transition-colors">Ideas</Link></li>
                  <li><Link href="/projects" className="text-rosePine-text hover:text-rosePine-pine transition-colors">Projects</Link></li>
                  <li><Link href="/tools" className="text-rosePine-text hover:text-rosePine-pine transition-colors">Tools</Link></li>
                  <li><Link href="/designs" className="text-rosePine-text hover:text-rosePine-pine transition-colors">Designs</Link></li>
                  <li><Link href="/books" className="text-rosePine-text hover:text-rosePine-pine transition-colors">Books</Link></li>
                  <li><ThemeToggle /></li>
                </ul>
              </div>
            </nav>
          </header>
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-rosePine-base text-rosePineDawn-text dark:text-rosePine-text py-12">
            <div className="container mx-auto px-4 text-center">
              <p>&copy; {new Date().getFullYear()} &and; &or;. All rights reserved.</p>
            </div>
          </footer>
        </ThemeProvider>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollTrigger.min.js" />
      </body>
    </html>
  )
}

