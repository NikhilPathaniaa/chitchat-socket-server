/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        secondary: '#9333EA',
        background: '#F3F4F6',
        'chat-bg': '#FFFFFF',
      },
      animation: {
        'bounce-slow': 'bounce 3s linear infinite',
      },
    },
  },
  plugins: [],
  important: '#__next',
}
