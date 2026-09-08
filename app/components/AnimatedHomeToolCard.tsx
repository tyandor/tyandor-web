'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface AnimatedHomeToolCardProps {
  slug: string
  title: string
  description: string
  category: string
  image: string
}

const AnimatedHomeToolCard: React.FC<AnimatedHomeToolCardProps> = ({ slug, title, description, category, image }) => {
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
    <Link href={`/tools/${slug}`}>
      <div ref={cardRef} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-layer-01">
        <Image
          src={image}
          alt={title}
          width={600}
          height={400}
          className="object-cover w-full h-48"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold font-mono mb-2 text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary mb-2">{description}</p>
          <span className="text-xs text-link">{category}</span>
        </div>
      </div>
    </Link>
  )
}

export default AnimatedHomeToolCard

