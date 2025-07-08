import Image from 'next/image'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import Logo from '../../public/tyandor-logo.svg'

export function Navigation() {
  return (
    <header className="bg-rosePine-overlay dark:text-rosePine-text">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-rosePine-love hover:text-rosePine-gold transition-colors">
            <Image src={Logo} width={100} alt="logo for tyandor.com" />
          </Link>
          <ul className="flex space-x-6 items-center">
            <li><Link href="/" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Home</Link></li>
            <li><Link href="/about" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">About</Link></li>
            <li><Link href="/articles" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Articles</Link></li>
            <li><Link href="/quotes" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Quotes</Link></li>
            <li><Link href="/ideas" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Ideas</Link></li>
            <li><Link href="/projects" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Projects</Link></li>
            <li><Link href="/tools" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Tools</Link></li>
            <li><Link href="/designs" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Design</Link></li>
            <li><Link href="/books" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Books</Link></li>
            <li><ThemeToggle /></li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
