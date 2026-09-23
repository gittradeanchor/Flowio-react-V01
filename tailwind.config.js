/** @type {import('tailwindcss').Config} */
// Brand: "Copper & Ink" (proposal, 20 Sept 2026). Class names keep the old keys (navy, orange, bg-off) so no markup changes:
//   navy   = ink   #1C1917      orange = copper #B4501A (hover #8F3F12)
//   bg.off = paper #F6F1E9      border = warm hairline
// Contrast (computed): white on copper 5.12:1, copper on paper 4.55:1, ink on paper 15.6:1, muted on paper 6.8:1.
// border.strong (added, 23 Sept): the hairline border (#E4DCCF, 1.36:1 on white) is fine for dividers, but too
// faint for an unselected form field to read as a field. border.strong (#8A7F72) is 3.92:1 on white / 3.48:1 on
// paper, clearing the 3:1 WCAG 1.4.11 floor for a UI component boundary. Use on form fields only; keep border
// for cards and dividers.
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        display: ['Archivo', '"Source Sans 3"', 'sans-serif'],
        mono: ['ui-monospace', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        navy: {
          DEFAULT: '#1C1917',
          light: '#292524',
        },
        orange: {
          DEFAULT: '#B4501A',
          hover: '#8F3F12',
        },
        green: '#2F6B3F',
        border: {
          DEFAULT: '#E4DCCF',
          strong: '#8A7F72',
        },
        bg: {
          DEFAULT: '#FFFFFF',
          off: '#F6F1E9',
        },
        text: {
          main: '#292524',
          muted: '#57534E',
        }
      },
      borderRadius: {
        lg: '4px',
        xl: '6px',
        '2xl': '8px',
        '3xl': '10px',
      },
      boxShadow: {
        'btn-primary': '0 2px 0 #6F320F',
        'btn-primary-active': '0 1px 0 #6F320F',
        'btn-navy': '0 2px 0 #000000',
        'btn-white': '0 2px 0 #D6CCBC',
      }
    },
  },
  plugins: [],
}
