'use client'

import { Metadata } from 'next'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// export const metadata: Metadata = {
// title: 'About | My Blog',
// description: 'Learn more about the author and purpose of this blog',
// }

export default function AboutPage() {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const animation = gsap.fromTo(
      contentRef.current,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top bottom-=100',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
        },
      }
    )

    return () => {
      animation.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-rosePine-rose">About Me</h1>
      <div ref={contentRef} className="prose prose-rosePine dark:prose-rosePineDawn opacity-0">
        <p className="mb-4">
          Hello! I'm the author of this blog. I'm passionate about technology, writing, and sharing knowledge with others.
        </p>
        <p className="mb-4">
          This blog is a platform where I share my thoughts, experiences, and insights on various topics including web development, technology trends, and personal growth.
        </p>
        <p className="mb-4">
          Feel free to explore my posts, articles, ideas, and projects. If you have any questions or just want to chat, don't hesitate to reach out!
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-rosePine-gold">My Background</h2>
        <p className="mb-4">
          I have a background in computer science and have been working in the tech industry for several years. My expertise includes web development, cloud computing, and artificial intelligence.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-rosePine-gold">Blog's Purpose</h2>
        <p className="mb-4">
          The main purpose of this blog is to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Share knowledge and insights from my experiences</li>
          <li>Discuss latest trends and technologies in the tech world</li>
          <li>Provide tutorials and how-to guides for fellow developers</li>
          <li>Explore innovative ideas and concepts</li>
        </ul>
        <p className="mb-4">
          Thank you for visiting, and I hope you find the content here valuable and engaging!
        </p>
      </div>
    </div>
  )
}

