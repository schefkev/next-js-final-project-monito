/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#19555E',

          secondary: '#07132F',

          accent: '#CF9B5E',

          neutral: '#DFE0DF',

          'base-100': '#FFF7EB',

          info: '#FFEBCC',

          success: '#96682D',

          warning: '#36D399',

          error: '#F87272',

          noice: '#07132F',
        },
      },
    ],
  },
};
