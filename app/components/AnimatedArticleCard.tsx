'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface AnimatedArticleCardProps {
  slug: string
  title: string
  description: string
  date: string
  author: string
}

const AnimatedArticleCard: React.FC<AnimatedArticleCardProps> = ({ slug, title, description, date, author }) => {
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
    <div
      ref={cardRef}
      className="bg-rosePine-surface dark:bg-rosePineMoon-surface shadow-md rounded-lg overflow-hidden border border-rosePine-highlightLow dark:border-rosePineMoon-highlightLow"
    >
      <div className="p-6">
        <Link href={`/articles/${slug}`} className="text-xl font-semibold text-rosePine-gold dark:text-rosePineMoon-gold hover:text-rosePine-rose dark:hover:text-rosePineMoon-rose transition-colors mb-2 block">
          {title}
        </Link>
        <p className="text-rosePine-text dark:text-rosePineMoon-text mb-4">
          {description}
        </p>
        <div className="flex justify-between items-center text-sm text-rosePine-subtle dark:text-rosePineMoon-subtle">
          <span>{author}</span>
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
        <Link href={`/articles/${slug}`} className="mt-4 inline-block text-rosePine-foam dark:text-rosePineMoon-foam hover:text-rosePine-pine dark:hover:text-rosePineMoon-pine transition-colors">
          Read more
        </Link>
      </div>
    </div>
  )
}

export default AnimatedArticleCard

