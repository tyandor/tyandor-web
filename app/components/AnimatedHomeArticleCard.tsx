'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface AnimatedHomeArticleCardProps {
  slug: string
  title: string
  description: string
}

const AnimatedHomeArticleCard: React.FC<AnimatedHomeArticleCardProps> = ({ slug, title, description }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    gsap.fromTo(
      cardRef.current,
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
          trigger: cardRef.current,
          start: 'top bottom-=100',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  return (
    <div ref={cardRef} className="bg-rosePine-surface dark:bg-rosePineMoon-surface overflow-hidden rounded-lg border border-rosePine-highlightLow dark:border-rosePineMoon-highlightLow mb-4">
      <div className="p-4 md:p-8">
        <Link href={`/articles/${slug}`} className="text-2xl font-bold text-rosePine-text dark:text-rosePineMoon-gold hover:text-rosePine-rose dark:hover:text-rosePineMoon-rose transition-colors mb-2 block">
          {title}
        </Link>
        <p className="text-rosePine-text dark:text-rosePineMoon-text mb-4">
          {description}
        </p>
        <Link href={`/articles/${slug}`} className="text-rosePine-foam dark:text-rosePineMoon-foam hover:text-rosePine-pine dark:hover:text-rosePineMoon-pine transition-colors">
          Read more
        </Link>
      </div>
    </div>
  )
}

export default AnimatedHomeArticleCard

