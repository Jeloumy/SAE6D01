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
        highContrast:{
          'primary': '#000000',
          'neutral': '#000000',
          'success': '#ffffff',
          'success-content':'#000000',
          'info': '#000000',
          'info-content':'#ffffff',
          'accent':'#000000',
        },
      },
      {
        light:{
          'success': '#134E4A',
          'success-content': '#ffffff',
          'accent': '#2DD4BF',
          'info':'#ffffff',
          'info-content':'#000000',
        },
      },
      {
        dark:{
          'primary': '#1e293b',
          'neutral': '#1e293b',
          'success': '#134E4A',
          'success-content':'#ffffff',
          'info': '#1e293b',
          'info-content':'#ffffff',
          'accent':'#1e293b',
        },
      }
    ],
  },
  important: true,
}
