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
    <div ref={quoteRef} className="my-12 p-8 opacity-0"> {/* Add opacity-0 to hide it initially */}
      <blockquote className="text-xl italic font-semibold text-rosePine-text dark:text-rosePineMoon-text">
        "{quote}"
      </blockquote>
      <p className="mt-4 text-right text-rosePine-subtle dark:text-rosePineMoon-subtle">
        — {author}
      </p>
      <Link href={`/quotes/${slug}`} className="mt-4 inline-block text-rosePine-foam dark:text-rosePineMoon-foam hover:text-rosePine-pine dark:hover:text-rosePineMoon-pine transition-colors">
        Read more
      </Link>
    </div>
  )
}

export default AnimatedHomeQuote

