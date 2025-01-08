'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div className="p-4 border rounded-md bg-rosePine-surface">
      <p className="text-rosePine-text mb-2">Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-rosePine-pine text-rosePine-text rounded hover:bg-rosePine-foam transition-colors"
      >
        Increment
      </button>
    </div>
  )
}

