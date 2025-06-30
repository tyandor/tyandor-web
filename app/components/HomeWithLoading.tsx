'use client'

import { useState, useEffect } from 'react'
import { LoadingAnimation } from './LoadingAnimation'
import { HomeContent } from './HomeContent'

interface Article {
  slug: string
  title: string
  date: string
  description: string
  author: string
}

interface Quote {
  slug: string
  author: string
  quote: string
}

interface Tool {
  slug: string
  title: string
  description: string
  category: string
  image: string
}

interface Design {
  slug: string
  title: string
  description: string
  image: string
}

interface HomeWithLoadingProps {
  recentArticles: Article[]
  randomQuote: Quote | null
  recentTools: Tool[]
  recentDesigns: Design[]
}

export function HomeWithLoading({ recentArticles, randomQuote, recentTools, recentDesigns }: HomeWithLoadingProps) {
  const [showLoading, setShowLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Always show loading animation for now (remove sessionStorage check for testing)
    // const hasSeenLoading = sessionStorage.getItem('hasSeenLoading')
    // if (hasSeenLoading) {
    //   setShowLoading(false)
    //   setShowContent(true)
    // }
  }, [])

  const handleLoadingComplete = () => {
    setShowContent(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hasSeenLoading', 'true')
    }
  }

  return (
    <>
      {showLoading && <LoadingAnimation onComplete={handleLoadingComplete} />}
      {showContent && (
        <HomeContent
          recentArticles={recentArticles}
          randomQuote={randomQuote}
          recentTools={recentTools}
          recentDesigns={recentDesigns}
        />
      )}
    </>
  )
}