// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Noto Sans TC',
          'AdobeZh',
          'lansui',
          ...defaultTheme.fontFamily.sans,
        ],
        numeric: [
          'KdamThmorPro',
          'YuPearl',
          'lansui',
          ...defaultTheme.fontFamily.sans,
        ],
        kurewa: ['KurewaGothicCjkTc'],
        ud: ['UDDigiKyokashoN'],
      },
      keyframes: {
        drop: {
          '0%': { transform: 'translateY(-1em)', opacity: 0.0 },
          '15%': { transform: 'translateY(0)', opacity: 1.0 },
          '85%': { transform: 'translateY(0)', opacity: 1.0 },
          '100%': { transform: 'translateY(1.75em)', opacity: 0.0 },
        },
        fadeIn: {
          '0%': { opacity: 0.0, top: '-15px', position: 'relative' },
          '100%': { opacity: 1.0, top: '0px', position: 'relative' },
        },
        fadeInFromBottom: {
          '0%': { opacity: 0.0, bottom: '-32px' },
          '100%': { opacity: 1.0, bottom: '0px' },
        },
        fadeInFromLeft: {
          '0%': { opacity: 0.0, left: '-15px', position: 'relative' },
          '100%': { opacity: 1.0, left: '0px', position: 'relative' },
        },
        scrollFromRightToLeft: {
          '0%': { transform: 'translateX(150%)' },
          '100%': { transform: 'translateX(-150%)' },
        },
        yellowPenaltyAni: {
          '0%': {
            backgroundColor: '#ffe100',
            transform: 'rotate(45deg) translateX(-130%)',
          },
          '20%': {
            backgroundColor: '#ffe100',
            transform: 'rotate(45deg) translateX(-50%)',
          },
          '80%': {
            backgroundColor: '#ffe100',
            transform: 'rotate(45deg) translateX(-50%)',
          },
          '100%': {
            backgroundColor: '#ffe100',
            transform: 'rotate(45deg) translateX(50%)',
          },
        },
        redPenaltyAni: {
          '0%': {
            backgroundColor: '#ff1900',
            transform: 'rotate(45deg) translateX(-130%)',
          },
          '20%': {
            backgroundColor: '#ff1900',
            transform: 'rotate(45deg) translateX(-50%)',
          },
          '80%': {
            backgroundColor: '#ff1900',
            transform: 'rotate(45deg) translateX(-50%)',
          },
          '100%': {
            backgroundColor: '#ff1900',
            transform: 'rotate(45deg) translateX(50%)',
          },
        },
        riichi: {
          '0%': {
            transform: 'translateX(-25%) translateY(-50%) rotate(-25deg)',
          },
          '37%': {
            transform: 'translateX(-25%) translateY(-50%) rotate(-25deg)',
          },
          '50%': {
            transform: 'translateX(-25%) translateY(-50%) rotate(-280deg)',
          },
          '58%': {
            transform: 'translateX(-25%) translateY(-50%) rotate(-385deg)',
          },
          '61%': {
            transform: 'translateX(-25%) translateY(-50%) rotate(-385deg)',
          },
          '65%': {
            transform: 'translateX(-25%) translateY(-120%) rotate(-385deg)',
          },
          '73%': {
            transform: 'translateX(200%) translateY(-120%)',
          },
          '74%': {
            transform: 'translateX(200%) translateY(200%)',
          },
          '75%': {
            transform: 'translateX(-25%) translateY(100%)',
          },
          '80%': {
            transform: 'translateX(-25%) translateY(0%)',
          },
          '85%': {
            transform: 'translateX(-25%) translateY(0%)',
          },
          '100%': {
            transform: 'translateX(-25%) translateY(-50%) rotate(-25deg)',
          },
        },
      },
    },
  },
  plugins: [],
}
