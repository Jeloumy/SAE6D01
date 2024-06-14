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
  daisyui: {
    themes: [
      'light',
      'dark',
      // Uncomment and customize the following themes as needed
      // {
      //   hightContrast: {
      //     'primary': '#000000',
      //     'neutral': '#000000',
      //     'success': '#ffffff',
      //     'success-content': '#000',
      //     'info': '#000',
      //     'info-content': '#fff',
      //     'accent': '#000',
      //   },
      // },
      // {
      //   customLight: {
      //     'success': '#134E4A',
      //     'success-content': '#134E4A',
      //     'accent': '#2DD4BF',
      //     'info': '#fff',
      //     'info-content': '#000',
      //   },
      // },
    ],
  },
  important: true,
}
