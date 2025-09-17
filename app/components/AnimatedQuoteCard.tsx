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
        className="w-full my-12 p-6 text-rosePine-text dark:text-rosePineMoon-text hover:text-rosePine-subtle transition-text"
      >
        <blockquote className="text-3xl leading-[1.5] font-semibold italic font-serif py-10">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <p className="text-right text-rosePine-subtle dark:text-rosePineMoon-subtle">- {author}</p>
      </div>
    </Link>
  )
}

export default AnimatedQuoteCard

