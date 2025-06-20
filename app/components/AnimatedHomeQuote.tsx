'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface AnimatedHomeQuoteProps {
  quote: string
  author: string
  slug: string
}

const AnimatedHomeQuote: React.FC<AnimatedHomeQuoteProps> = ({ quote, author, slug }) => {
  const quoteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const animation = gsap.fromTo(
      quoteRef.current,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: quoteRef.current,
          start: 'top bottom-=100',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Delay the animation start
    ScrollTrigger.create({
      trigger: '.articles-section', // Add this class to the articles section in the homepage
      start: 'bottom center',
      onEnter: () => animation.play(),
    })

    return () => {
      animation.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={quoteRef} className="my-8 p-4 opacity-0"> {/* Add opacity-0 to hide it initially */}
      <blockquote className="text-4xl italic font-bold font-serif text-rosePine-text dark:text-rosePineMoon-text">
        "{quote}"
        <footer>
          <p className="mt-4 non-italic text-sm font-sans text-right text-rosePine-subtle dark:text-rosePineMoon-subtle">
            — {author}
          </p>
        </footer>
      </blockquote>
      <div className="my-8 text-center">
        <Link href="/quotes" className="mt-4 inline-block text-rosePine-love dark:text-rosePineMoon-text hover:text-rosePine-pine dark:hover:text-rosePineMoon-pine transition-colors">
          <span className="text-2xl">&#10077;</span> Quotes 
        </Link>
      </div>
    </div>
  )
}

export default AnimatedHomeQuote

