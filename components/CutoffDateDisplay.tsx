'use client'

import { useState, useEffect } from 'react'

interface Props {
  cutoffDate: Date
}

export default function CutoffDateDisplay({ cutoffDate }: Props) {
  const [label, setLabel] = useState('')

  useEffect(() => {
    setLabel(
      cutoffDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    )
  }, [cutoffDate])

  return <span>{label}</span>
}
