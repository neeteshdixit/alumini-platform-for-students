import { motion } from 'framer-motion'

import { useThemeStore } from '../../store/themeStore'

const MotionButton = motion.button

function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  return (
    <MotionButton
      aria-label="Toggle theme"
      className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      onClick={toggleTheme}
      type="button"
      whileTap={{ scale: 0.95 }}
    >
      <span className="material-symbols-outlined text-[18px]">
        {theme === 'dark' ? 'dark_mode' : 'light_mode'}
      </span>
      <span className="hidden sm:inline">{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </MotionButton>
  )
}

export default ThemeToggle
