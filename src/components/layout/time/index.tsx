'use client'

import { useState, useEffect } from 'react'

function getUtcPlusOne() {
  // UTC+1, fixed offset (no DST)
  const utc1 = new Date(Date.now() + 60 * 60 * 1000)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(utc1.getUTCHours())}:${pad(utc1.getUTCMinutes())} UTC+1 `
}

export function Time() {
  const [time, setTime] = useState(getUtcPlusOne())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getUtcPlusOne())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
      <span className="absolute bottom-(--grid-margin) left-(--grid-margin) mix-blend-exclusion text-white">{time}</span>
  )
}
