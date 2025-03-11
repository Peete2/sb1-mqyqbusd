/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#febf10',
        secondary: '#000000',
        accent: {
          gray: '#F5F5F5',
          blue: '#E6F3FF',
        },
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        'outfit': ['Outfit', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#333',
            h2: {
              fontFamily: 'outfit, sans-serif',
              fontWeight: '700',
              marginTop: '2em',
              marginBottom: '1em',
            },
            p: {
              fontFamily: 'Open Sans, sans-serif',
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};