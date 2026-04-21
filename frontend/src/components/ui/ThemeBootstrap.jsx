import { useEffect } from 'react'

import { useThemeStore } from '../../store/themeStore'

function ThemeBootstrap({ children }) {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.dataset.theme = theme
    root.style.colorScheme = theme === 'dark' ? 'dark' : 'light'
  }, [theme])

  return children
}

export default ThemeBootstrap
