'use client'

import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

const AnimatedBox: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (boxRef.current) {
      gsap.to(boxRef.current, {
        rotation: 360,
        duration: 2,
        repeat: -1,
        ease: "power2.inOut",
      })
    }
  }, [])

  return (
    <div className="flex justify-center items-center h-40">
      <div 
        ref={boxRef} 
        className="w-20 h-20 bg-rosePine-pine dark:bg-rosePineDawn-pine"
      >
        Animated Box
      </div>
    </div>
  )
}

export default AnimatedBox

