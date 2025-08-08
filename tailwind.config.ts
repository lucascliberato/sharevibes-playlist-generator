import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-space-grotesk)'],
        mono: ['var(--font-vt323)'],
      },
      colors: {
        primary: {
          purple: '#a238ff',
          'purple-dark': '#8b00ff',
          magenta: '#ff006e',
        },
        dark: {
          bg: '#0f0f23',
          'bg-secondary': '#1a1a2e',
          text: '#e2e8f0',
          'text-secondary': '#94a3b8',
        },
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #ff006e, #a238ff)',
        'gradient-dark': 'linear-gradient(135deg, #1a1a2e, #0f0f23)',
        'gradient-neon': 'linear-gradient(90deg, #ff006e, #a238ff, #8b00ff)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(162, 56, 255, 0.5), 0 0 40px rgba(162, 56, 255, 0.3)',
        'tape': '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'tape-spin': 'tape-spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config