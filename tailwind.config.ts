import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        loom: {
          yellow: 'var(--loom-yellow)',
          cyan: 'var(--loom-cyan)',
          purple: 'var(--loom-purple)',
          black: 'var(--loom-black)',
          white: 'var(--loom-white)',
        },
        glitch: {
          pink: 'var(--glitch-pink)',
          darkpurple: 'var(--glitch-darkpurple)',
          blue: 'var(--glitch-blue)',
        }
      },
      backgroundImage: {
        'loom-gradient': 'linear-gradient(to right, #FFD700, #00FFFF, #8B00FF)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
