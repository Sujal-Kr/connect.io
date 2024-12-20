/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        darkgreen: '#00967d',
        lightgreen: "#b5d3d5",
        primary: "#4361ee",
        plain: "#f8f9fa",
        custom: "#fdfcfb",
      },
      backgroundImage: {
        pattern: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23c7f9cc' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E\")",
        noise: "url('/src/assets/wallpaper.svg')",
        chat_background: "url('/src/assets/chat_background.webp')",
      },
      colors: {
        primary: "#4361ee",
        darkgreen: '#00967d',
        lightgreen: "#b5d3d5",
      },
    },
  },
  plugins: [],
}
