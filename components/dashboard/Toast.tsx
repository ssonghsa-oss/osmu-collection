'use client'

import { useEffect, useState } from 'react'

interface Props {
  message: string
  show: boolean
  onHide: () => void
}

export default function Toast({ message, show, onHide }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const t = setTimeout(() => { setVisible(false); setTimeout(onHide, 300) }, 2000)
      return () => clearTimeout(t)
    }
  }, [show, onHide])

  if (!show) return null

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300"
      style={{ opacity: visible ? 1 : 0, transform: `translateX(-50%) translateY(${visible ? 0 : 12}px)` }}
    >
      <div className="flex items-center gap-2 px-5 py-3 rounded-full text-white text-sm font-medium shadow-lg"
        style={{ backgroundColor: '#1E1B2E' }}>
        {message}
      </div>
    </div>
  )
}
