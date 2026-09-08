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
    <div ref={cardRef} className="bg-layer-01 overflow-hidden rounded-lg border border-border-subtle mb-4">
      <div className="p-4 md:p-8">
        <Link href={`/articles/${slug}`} className="text-2xl font-bold font-mono text-text-primary hover:text-text-emphasis transition-colors mb-2 block">
          {title}
        </Link>
        <p className="text-text-primary mb-4">
          {description}
        </p>
        <Link href={`/articles/${slug}`} className="text-link hover:text-link-hover transition-colors">
          Read more
        </Link>
      </div>
    </div>
  )
}

export default AnimatedHomeArticleCard

