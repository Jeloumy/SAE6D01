/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui:{
    themes: [
      {
        hightContrast:{
          'primary': '#000000',
          'neutral': '#000000',
          'success': '#ffffff',
        },
      },
      {
        light:{
          'success': '#134E4A',
          'accent': '#2DD4BF',
        },
      },
    ],
  }
}