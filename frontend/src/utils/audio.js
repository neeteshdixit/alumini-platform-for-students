const createAudioContext = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) {
    return null
  }

  return new AudioContextClass()
}

const playTone = ({ frequency, duration = 0.16, type = 'sine', gain = 0.045 }) => {
  const context = createAudioContext()
  if (!context) return

  const oscillator = context.createOscillator()
  const volume = context.createGain()
  oscillator.type = type
  oscillator.frequency.value = frequency
  volume.gain.value = gain

  oscillator.connect(volume)
  volume.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + duration)
}

export const playDingSound = () => {
  playTone({ frequency: 880, duration: 0.12, type: 'sine', gain: 0.04 })
  window.setTimeout(() => {
    playTone({ frequency: 1320, duration: 0.09, type: 'triangle', gain: 0.025 })
  }, 60)
}

export const playPopSound = () => {
  playTone({ frequency: 220, duration: 0.08, type: 'triangle', gain: 0.035 })
  window.setTimeout(() => {
    playTone({ frequency: 330, duration: 0.1, type: 'square', gain: 0.02 })
  }, 90)
}

export const playWelcomeSound = () => {
  playTone({ frequency: 659, duration: 0.14, type: 'sine', gain: 0.04 })
  window.setTimeout(() => {
    playTone({ frequency: 784, duration: 0.14, type: 'sine', gain: 0.03 })
  }, 130)
  window.setTimeout(() => {
    playTone({ frequency: 988, duration: 0.18, type: 'triangle', gain: 0.025 })
  }, 260)
}

