'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import Logo from '../../public/tyandor-logo.svg'
import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

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
    <header className="bg-rosePine-overlay dark:text-rosePine-text">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-rosePine-love text-rosePine-base px-4 py-2 rounded-md z-50">
        Skip to main content
      </a>
      <nav className="container mx-auto px-4 py-6" role="navigation" aria-label="Main navigation">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-rosePine-love hover:text-rosePine-gold transition-colors" aria-label="Tyler Andor homepage">
            <Image src={Logo} width={100} alt="Tyler Andor logo" />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex space-x-6 items-center" role="menubar">
            <li role="menuitem"><Link href="/" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Home</Link></li>
            <li role="menuitem"><Link href="/about" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">About</Link></li>
            <li role="menuitem"><Link href="/articles" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Articles</Link></li>
            <li role="menuitem"><Link href="/quotes" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Quotes</Link></li>
            <li role="menuitem"><Link href="/ideas" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Ideas</Link></li>
            <li role="menuitem"><Link href="/projects" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Projects</Link></li>
            <li role="menuitem"><Link href="/tools" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Tools</Link></li>
            <li role="menuitem"><Link href="/designs" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Design</Link></li>
            <li role="menuitem"><Link href="/books" className="text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors">Books</Link></li>
            <li><ThemeToggle /></li>
          </ul>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center space-x-4">
            <ThemeToggle />

            {/* Hamburger Button */}
            <button
              ref={hamburgerRef}
              onClick={toggleMenu}
              className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none focus:ring-2 focus:ring-rosePine-love rounded"
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
            >
              <div ref={line1Ref} className="w-6 h-0.5 bg-rosePine-text dark:bg-rosePineDawn-text transition-colors"></div>
              <div ref={line2Ref} className="w-6 h-0.5 bg-rosePine-text dark:bg-rosePineDawn-text transition-colors"></div>
              <div ref={line3Ref} className="w-6 h-0.5 bg-rosePine-text dark:bg-rosePineDawn-text transition-colors"></div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className="lg:hidden overflow-hidden h-0 opacity-0"
        >
          <ul className="pt-6 space-y-4" role="menubar">
            <li role="menuitem"><Link href="/" className="block text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li role="menuitem"><Link href="/about" className="block text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors py-2" onClick={() => setIsMenuOpen(false)}>About</Link></li>
            <li role="menuitem"><Link href="/articles" className="block text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Articles</Link></li>
            <li role="menuitem"><Link href="/quotes" className="block text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Quotes</Link></li>
            <li role="menuitem"><Link href="/ideas" className="block text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Ideas</Link></li>
            <li role="menuitem"><Link href="/projects" className="block text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Projects</Link></li>
            <li role="menuitem"><Link href="/tools" className="block text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Tools</Link></li>
            <li role="menuitem"><Link href="/designs" className="block text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Design</Link></li>
            <li role="menuitem"><Link href="/books" className="block text-rosePine-muted hover:text-rosePine-text dark:text-rosePineDawn-text dark:hover:text-rosePineDawn-pine transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Books</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
