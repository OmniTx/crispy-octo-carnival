'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ defaultTheme }: { defaultTheme: string }) {
  const [theme, setTheme] = useState<string>(defaultTheme)

  useEffect(() => {
    // Check for saved preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.className = savedTheme
    } else {
      document.documentElement.className = defaultTheme
    }
  }, [defaultTheme])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.className = newTheme
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-brand-gray200/20 transition-colors theme-text-muted hover:text-brand-blue"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
