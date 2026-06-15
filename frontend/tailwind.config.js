/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'ativo-deep':    '#0a0e1a',
        'ativo-mid':     '#13182b',
        'ativo-surface': '#1a2540',
        'gold':          '#C9A84C',
        'gold-light':    '#e0c987',
        'ativo-success': '#4ade80',
        'ativo-danger':  '#f87171',
        'chart-1': '#C9A84C',
        'chart-2': '#60a5fa',
        'chart-3': '#a78bfa',
        'chart-4': '#34d399',
        'chart-5': '#fb923c',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
      },
      boxShadow: {
        gold:    '0 0 24px rgba(201,168,76,0.3), 0 4px 16px rgba(201,168,76,0.15)',
        'gold-lg': '0 0 36px rgba(201,168,76,0.5), 0 4px 24px rgba(201,168,76,0.25)',
        'gold-xl': '0 0 48px rgba(201,168,76,0.08)',
      },
      animation: {
        'float':      'floatY 6s ease-in-out infinite',
        'float-sm':   'floatYSm 3s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-12px)' },
        },
        floatYSm: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-5px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 24px rgba(201,168,76,.3),0 4px 16px rgba(201,168,76,.15)' },
          '50%':       { boxShadow: '0 0 40px rgba(201,168,76,.5),0 4px 24px rgba(201,168,76,.3)' },
        },
      },
    },
  },
  plugins: [],
}
