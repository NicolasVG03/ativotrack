import { useEffect, useLayoutEffect, useRef } from 'react'

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'] as const

export function useInactivityTimeout(timeoutMs: number, onTimeout: () => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onTimeoutRef = useRef(onTimeout)

  useLayoutEffect(() => {
    onTimeoutRef.current = onTimeout
  })

  useEffect(() => {
    function resetTimer() {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => onTimeoutRef.current(), timeoutMs)
    }

    resetTimer()

    ACTIVITY_EVENTS.forEach(event => window.addEventListener(event, resetTimer, { passive: true }))

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      ACTIVITY_EVENTS.forEach(event => window.removeEventListener(event, resetTimer))
    }
  }, [timeoutMs])
}
