'use client'

import { useEffect, useState } from 'react'

export function LoadingAnimation({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const initAnimation = () => {
      if (typeof window !== 'undefined' && window.gsap) {
        const timeline = window.gsap.timeline({
          onComplete: () => {
            setIsVisible(false)
            onComplete()
          }
        })

        // Calculate the position of the header logo
        const headerLogo = document.querySelector('header nav img')
        let targetX = -280
        let targetY = -280
        
        if (headerLogo) {
          const logoRect = headerLogo.getBoundingClientRect()
          const loadingLogoRect = document.querySelector('.loading-logo')?.getBoundingClientRect()
          
          if (loadingLogoRect) {
            const centerX = window.innerWidth / 2
            const centerY = window.innerHeight / 2
            
            targetX = logoRect.left + logoRect.width / 2 - centerX
            targetY = logoRect.top + logoRect.height / 2 - centerY
          }
        }

        timeline
          .to('.loading-logo', {
            scale: 0.16, // Scale to match the header logo size (100px from 640px)
            x: targetX,
            y: targetY,
            duration: 1,
            ease: 'power2.inOut',
            delay: 1.25
          })
          .to('.loading-overlay', {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut'
          }, '-=0.3')

        return timeline
      }
      return null
    }

    // Wait for GSAP to be available
    const checkGSAP = () => {
      if (typeof window !== 'undefined' && window.gsap) {
        const timeline = initAnimation()
        return timeline
      } else {
        // Retry after a short delay
        setTimeout(checkGSAP, 100)
      }
    }

    const timeline = checkGSAP()

    return () => {
      if (timeline) {
        timeline.kill()
      }
    }
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className="loading-overlay fixed inset-0 z-50 bg-rosePine-overlay dark:bg-rosePineMoon-overlay flex items-center justify-center">
      <div className="loading-logo">
        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-[640px] h-80">
          <defs>
            <linearGradient id="loadingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: '#ebbcba'}} />
              <stop offset="100%" style={{stopColor: '#D7827E'}} />
            </linearGradient>
          </defs>
          <path 
            d="M65 170 L120 50 L175 170" 
            fill="none" 
            stroke="url(#loadingGrad)" 
            strokeWidth="20" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M180 50 L235 170 L290 50" 
            fill="none" 
            stroke="url(#loadingGrad)" 
            strokeWidth="20" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
