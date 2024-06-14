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
          'primary': '#000000', //Always black
          'success': '#ffffff', //Background
          'info': '#000', //Black to White
          'info-content':'#fff', //White to Black
          'accent':'#000', //Button
          'neutral':"#000",
        },
      },
      {
        light:{
          'success': '#134E4A', //Background
          'accent': '#2DD4BF', //Button
          'info':'#fff', //Black to White
          'info-content':'#000', //White to Black
          'neutral':"#000",
        },
      },
      {
        dark:{
          'primary': '#000',
          'neutral': '#1e293b',
          'success': '#134E4A',
          'success-content':'#ffffff',
          'info': '#1e293b',
          'info-content':'#ffffff',
          'accent':'#1e293b',
          'neutral':"#000",
        },
      }
    ],
  },
  important: true,
}
