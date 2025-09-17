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

const AnimatedArticleCard: React.FC<AnimatedArticleCardProps> = ({ slug, title, description }) => {
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
    <Link href={`/articles/${slug}`}>
      <div className="w-full my-8 px-6 py-8 border rounded-lg hover:shadow-lg transition-shadow bg-rosePine-surface dark:bg-rosePineMoon-surface">
        <h2 className="text-lg font-bold font-mono">{title}</h2>
        <p className="text-sm text-rosePine-text dark:text-rosePineMoon-text">
          {description}
        </p>
      </div>
    </Link>
  )
}

export default AnimatedArticleCard

