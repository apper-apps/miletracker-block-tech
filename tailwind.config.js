/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          500: '#2C3E50',
          600: '#1a252f',
          700: '#151e27'
        },
        secondary: {
          50: '#f4f6f8',
          100: '#e5e9ed',
          500: '#34495E',
          600: '#2c3e50',
          700: '#1e2933'
        },
        accent: {
          50: '#e6f3ff',
          100: '#b3d9ff',
          500: '#3498DB',
          600: '#2980b9',
          700: '#1f4e8c'
        },
        success: '#27AE60',
        warning: '#F39C12',
        error: '#E74C3C',
        info: '#16A085'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 8px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}