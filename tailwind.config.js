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
          'primary': '#000', //Always black
          'success': '#ffffff', //Background
          'info': '#000', //Black to White
          'info-content':'#fff', //White to Black
          'accent':'#000', //Button
          'success-content':'#000',
          
        },
      },
      {
        light:{
          'success': '#134E4A', //Background
          'accent': '#2DD4BF', //Button
          'info':'#fff', //Black to White
          'info-content':'#000', //White to Black
        },
      },
      {
        dark:{
          'success': '#1e2124',
          'accent':'#aaa',
          'info': '#fff',
          'info-content': '#000',
          'neutral':'#eee',
          'warning-content':'#555',
          'base-content': '#888',
        },
      }
    ],
  },
  important: true,
}
