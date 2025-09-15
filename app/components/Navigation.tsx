import Image from 'next/image'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import Logo from '../../public/tyandor-logo.svg'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export async function Navigation() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="bg-rosePine-overlay dark:text-rosePine-text">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-rosePine-love text-rosePine-base px-4 py-2 rounded-md z-50">
        Skip to main content
      </a>
      <nav className="container mx-auto px-4 py-6" role="navigation" aria-label="Main navigation">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-rosePine-love hover:text-rosePine-gold transition-colors" aria-label="Tyler Andor homepage">
            <Image src={Logo} width={100} alt="Tyler Andor logo" />
          </Link>
          <ul className="flex space-x-6 items-center" role="menubar">
            <li role="menuitem"><Link href="/" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Home</Link></li>
            <li role="menuitem"><Link href="/about" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">About</Link></li>
            <li role="menuitem"><Link href="/articles" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Articles</Link></li>
            {user && (
              <li role="menuitem"><Link href="/radar" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Radar</Link></li>
            )}
            <li role="menuitem"><Link href="/quotes" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Quotes</Link></li>
            <li role="menuitem"><Link href="/ideas" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Ideas</Link></li>
            <li role="menuitem"><Link href="/projects" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Projects</Link></li>
            <li role="menuitem"><Link href="/tools" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Tools</Link></li>
            <li role="menuitem"><Link href="/designs" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Design</Link></li>
            <li role="menuitem"><Link href="/books" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Books</Link></li>
            {user ? (
              <li><LogoutButton /></li>
            ) : (
              <li role="menuitem"><Link href="/login" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Login</Link></li>
            )}
            <li><ThemeToggle /></li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
