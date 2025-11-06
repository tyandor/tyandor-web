'use client'

import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface AnimatedQuoteProps {
  quote: string;
  author: string;
  content: React.ReactNode; // MDX content
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
    <div className="mb-16" style={{minHeight:500}}>
      <blockquote ref={quoteRef} className="text-4xl leading-10 leading-[1.5] font-serif font-semibold italic mt-8">
        {quote}
      </blockquote>
      <p ref={authorRef} className="text-right text-rosePine-muted mb-12 mt-8">{author}</p>
      <div ref={contextRef} className="max-w-2xl mx-auto mt-8">
        <h2 className="text-xl text-rosePine-rose font-bold mb-4">Context</h2>
        <div className="prose text-rosePine-text dark:prose-rosePine-text max-w-none">
          {content}
        </div>
      </div>
    </div>
  )
}

export default AnimatedQuote

