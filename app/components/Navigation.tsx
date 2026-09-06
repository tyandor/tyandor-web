'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import Logo from '../../public/tyandor-logo.svg'
import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/*
 * One definition, eighteen call sites. The previous form repeated
 * `text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text
 * dark:hover:text-rosePineDawn-pine` on every link — and the `dark:` half of
 * that was doing nothing a reader would expect, since rosePine and
 * rosePineDawn resolve to the same variables. The token roles carry the theme
 * themselves, so there is no light/dark pair to state here at all.
 */
const navLink =
  'text-text-secondary hover:text-text-primary transition-colors duration-fast-02'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLDivElement>(null)
  const line2Ref = useRef<HTMLDivElement>(null)
  const line3Ref = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const tl = gsap.timeline()

    if (isMenuOpen) {
      tl.to(line1Ref.current, { rotation: 45, y: 6, duration: 0.3 })
        .to(line2Ref.current, { opacity: 0, duration: 0.3 }, '-=0.3')
        .to(line3Ref.current, { rotation: -45, y: -6, duration: 0.3 }, '-=0.3')
        .to(mobileMenuRef.current, { height: 'auto', opacity: 1, duration: 0.3 })
    } else {
      tl.to(mobileMenuRef.current, { height: 0, opacity: 0, duration: 0.3 })
        .to(line1Ref.current, { rotation: 0, y: 0, duration: 0.3 })
        .to(line2Ref.current, { opacity: 1, duration: 0.3 }, '-=0.3')
        .to(line3Ref.current, { rotation: 0, y: 0, duration: 0.3 }, '-=0.3')
    }
  }, [isMenuOpen])

  return (
    <header className="bg-layer-02 text-text-primary border-b border-border-subtle">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-interactive text-text-on-accent px-4 py-2 rounded-md z-50">
        Skip to main content
      </a>
      <nav className="container mx-auto px-4 py-6" role="navigation" aria-label="Main navigation">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-interactive hover:text-link-hover transition-colors" aria-label="Tyler Andor homepage">
            <Image src={Logo} width={100} alt="Tyler Andor logo" />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex space-x-6 items-center" role="menubar">
            <li role="menuitem"><Link href="/" className={navLink}>Home</Link></li>
            <li role="menuitem"><Link href="/about" className={navLink}>About</Link></li>
            <li role="menuitem"><Link href="/articles" className={navLink}>Articles</Link></li>
            <li role="menuitem"><Link href="/quotes" className={navLink}>Quotes</Link></li>
            <li role="menuitem"><Link href="/ideas" className={navLink}>Ideas</Link></li>
            <li role="menuitem"><Link href="/projects" className={navLink}>Projects</Link></li>
            <li role="menuitem"><Link href="/tools" className={navLink}>Tools</Link></li>
            <li role="menuitem"><Link href="/designs" className={navLink}>Design</Link></li>
            <li role="menuitem"><Link href="/books" className={navLink}>Books</Link></li>
            <li><ThemeToggle /></li>
          </ul>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center space-x-4">
            <ThemeToggle />

            {/* Hamburger Button */}
            <button
              ref={hamburgerRef}
              onClick={toggleMenu}
              className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none focus:ring-2 focus:ring-focus rounded"
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
            >
              <div ref={line1Ref} className="w-6 h-0.5 bg-text-primary transition-colors"></div>
              <div ref={line2Ref} className="w-6 h-0.5 bg-text-primary transition-colors"></div>
              <div ref={line3Ref} className="w-6 h-0.5 bg-text-primary transition-colors"></div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className="lg:hidden overflow-hidden h-0 opacity-0"
        >
          <ul className="pt-6 space-y-4" role="menubar">
            <li role="menuitem"><Link href="/" className={`block py-2 ${navLink}`} onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li role="menuitem"><Link href="/about" className={`block py-2 ${navLink}`} onClick={() => setIsMenuOpen(false)}>About</Link></li>
            <li role="menuitem"><Link href="/articles" className={`block py-2 ${navLink}`} onClick={() => setIsMenuOpen(false)}>Articles</Link></li>
            <li role="menuitem"><Link href="/quotes" className={`block py-2 ${navLink}`} onClick={() => setIsMenuOpen(false)}>Quotes</Link></li>
            <li role="menuitem"><Link href="/ideas" className={`block py-2 ${navLink}`} onClick={() => setIsMenuOpen(false)}>Ideas</Link></li>
            <li role="menuitem"><Link href="/projects" className={`block py-2 ${navLink}`} onClick={() => setIsMenuOpen(false)}>Projects</Link></li>
            <li role="menuitem"><Link href="/tools" className={`block py-2 ${navLink}`} onClick={() => setIsMenuOpen(false)}>Tools</Link></li>
            <li role="menuitem"><Link href="/designs" className={`block py-2 ${navLink}`} onClick={() => setIsMenuOpen(false)}>Design</Link></li>
            <li role="menuitem"><Link href="/books" className={`block py-2 ${navLink}`} onClick={() => setIsMenuOpen(false)}>Books</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
