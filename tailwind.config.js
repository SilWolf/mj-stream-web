module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
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
          '0%': { opacity: 0.0 },
          '100%': { opacity: 1.0 },
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
