'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface AnimatedIdeaCardProps {
  id: string
  title: string
  summary: string
  category: string
}

const AnimatedIdeaCard: React.FC<AnimatedIdeaCardProps> = ({ id, title, summary, category }) => {
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
    <Link href={`/ideas/${id}`}>
      <div
        ref={cardRef}
        className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-layer-01"
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold font-mono mb-2 text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary mb-2">{summary}</p>
          <span className="text-xs text-link">{category}</span>
        </div>
      </div>
    </Link>
  )
}

export default AnimatedIdeaCard

