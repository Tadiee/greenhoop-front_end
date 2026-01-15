/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'green': "#064E3B",
        "light-green": "#16A34A",
        "dark-green": "#052E20",
        'bground': "#1B211A",
        'accent-green': "#08CB00",
        'accent-white': "#EEEEEE",
        'accent-dark-green': "#253900",
        'gray-white': "#F5F2F2",
      },
      // --- ADD ANIMATIONS BELOW THIS LINE ---
      // keyframes: {
      //   float: {
      //     '0%, 100%': { transform: 'translateY(0)' },
      //     '50%': { transform: 'translateY(-10px)' },
      //   }
      // },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s linear infinite',
      },
      // --------------------------------------
    },
  },
  plugins: [],
}