'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface AnimatedDesignCardProps {
  slug: string
  title: string
  description: string
  category: string
  image: string
}

const AnimatedDesignCard: React.FC<AnimatedDesignCardProps> = ({ slug, title, description, category, image }) => {
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
    <Link href={`/designs/${slug}`}>
      <div
        ref={cardRef}
        className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-layer-01"
      >
        <Image
          src={image}
          alt={title}
          width={600}
          height={400}
          className="object-cover w-full h-48"
        />
        <div className="p-4">
          <h2 className="text-xl font-semibold font-mono mb-2 text-text-primary">{title}</h2>
          <p className="text-sm text-text-secondary mb-2">{description}</p>
          <span className="text-sm text-link">{category}</span>
        </div>
      </div>
    </Link>
  )
}

export default AnimatedDesignCard

