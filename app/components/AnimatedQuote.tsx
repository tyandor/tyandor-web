'use client'

import React, { useRef, useEffect } from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import gsap from 'gsap'

interface AnimatedQuoteProps {
  quote: string;
  author: string;
  content: any; // Change this to 'any' to accept the MDX content
}

const AnimatedQuote: React.FC<AnimatedQuoteProps> = ({ quote, author, content }) => {
  const quoteRef = useRef<HTMLQuoteElement>(null)
  const authorRef = useRef<HTMLParagraphElement>(null)
  const contextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // Reset the opacity and position of elements
    gsap.set([quoteRef.current, authorRef.current, contextRef.current], { opacity: 0, y: 20 })

    tl.to(quoteRef.current, { opacity: 1, y: 0, duration: 1 })
      .to(authorRef.current, { opacity: 1, y: 0, duration: 1 }, "-=0.5")
      .to(contextRef.current, { opacity: 1, y: 0, duration: 1 }, "-=0.5")

    return () => {
      tl.kill() // Clean up the animation when the component unmounts or re-renders
    }
  }, [quote, author, content]) // Re-run the animation when these props change

  return (
    <div>
      <blockquote ref={quoteRef} className="text-2xl font-semibold italic mb-4">
        "{quote}"
      </blockquote>
      <p ref={authorRef} className="text-right text-rosePine-muted mb-8">- {author}</p>
      <div ref={contextRef}>
        <h2 className="text-xl font-bold mb-4">Context:</h2>
        <div className="prose max-w-none">
          {content}
        </div>
      </div>
    </div>
  )
}

export default AnimatedQuote

