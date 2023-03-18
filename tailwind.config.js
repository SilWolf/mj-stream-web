module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        kurewa: ['KurewaGothicCjkTc'],
        ud: ['UDDigiKyokashoN'],
      },
      keyframes: {
        fadeIn: {
          '0%': { transform: 'translateY(-1em)', opacity: 0.0 },
          '15%': { transform: 'translateY(0)', opacity: 1.0 },
          '85%': { transform: 'translateY(0)', opacity: 1.0 },
          '100%': { transform: 'translateY(1.75em)', opacity: 0.0 },
        },
      },
    },
  },
  plugins: [],
}
