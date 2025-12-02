/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        navy: {
          DEFAULT: '#0F172A',
          light: '#1E293B',
        },
        orange: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
        },
        green: '#10B981',
        border: '#E2E8F0',
        bg: {
          DEFAULT: '#FFFFFF',
          off: '#F8FAFC',
        },
        text: {
          main: '#1E293B',
          muted: '#64748B',
        }
      },
      boxShadow: {
        'btn-primary': '0 4px 0 #C2410B, 0 8px 20px -4px rgba(249, 115, 22, 0.5)',
        'btn-primary-active': '0 2px 0 #C2410B',
        'btn-navy': '0 4px 0 #020617, 0 4px 12px rgba(15, 23, 42, 0.3)',
        'btn-white': '0 4px 0 #CBD5E1',
      }
    },
  },
  plugins: [],
}