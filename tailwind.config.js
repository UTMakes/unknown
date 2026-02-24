/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'cyber': {
          900: '#0a0e14',
          800: '#141a23',
          700: '#1a2332',
          600: '#2a3447',
          500: '#3b82f6',
          400: '#60a5fa',
          accent: '#00d4ff',
          success: '#10b981',
          danger: '#ef4444',
          warning: '#f59e0b',
          code: '#a855f7'
        }
      },
      fontFamily: {
        'display': ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace']
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
      }
    }
  },
  plugins: [],
}
