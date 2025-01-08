'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface AnimatedQuoteCardProps {
  id: string
  quote: string
  author: string
}

const AnimatedQuoteCard: React.FC<AnimatedQuoteCardProps> = ({ id, quote, author }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 100,
        rotateX: 45,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top bottom-=100',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  return (
    <Link href={`/quotes/${id}`}>
      <div
        ref={cardRef}
        className="w-full my-12 p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow bg-rosePine-surface dark:bg-rosePineMoon-surface"
      >
        <blockquote className="text-xl font-semibold italic text-rosePine-text dark:text-rosePineMoon-text mb-4">
          "{quote}"
        </blockquote>
        <p className="text-right text-rosePine-subtle dark:text-rosePineMoon-subtle">- {author}</p>
      </div>
    </Link>
  )
}

export default AnimatedQuoteCard

