'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div className="p-4 border rounded-md bg-layer-01">
      <p className="text-text-primary mb-2">Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-interactive text-text-on-color rounded hover:bg-interactive-hover transition-colors"
      >
        Increment
      </button>
    </div>
  )
}

