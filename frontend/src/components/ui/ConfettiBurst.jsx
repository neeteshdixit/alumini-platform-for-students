import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

function ConfettiBurst({ active, duration = 3500 }) {
  const { width, height } = useWindowSize()

  useEffect(() => {
    if (!active) {
      return undefined
    }

    const timeout = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('alumni:confetti:end'))
    }, duration)

    return () => window.clearTimeout(timeout)
  }, [active, duration])

  if (!active) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      <Confetti
        colors={['#0f172a', '#2563eb', '#14b8a6', '#f97316', '#facc15', '#22c55e']}
        confettiSource={{ x: width / 2, y: height * 0.16, w: 10, h: 10 }}
        gravity={0.22}
        height={height}
        numberOfPieces={180}
        recycle={false}
        width={width}
      />
    </div>
  )
}

export default ConfettiBurst
