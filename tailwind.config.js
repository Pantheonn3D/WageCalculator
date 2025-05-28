// tailwind.config.js
/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'; // Ensure you have tailwindcss/colors installed if you use its color objects

export default {
  darkMode: 'class', // Or 'media'
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Make sure this covers all your component files
  ],
  theme: {
    extend: {
      backgroundImage: {
        // Subtle gradients for the main app background
        'subtle-gradient-light': 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)', // White to Gray-50
        'subtle-gradient-dark': 'linear-gradient(180deg, #171717 0%, #0A0A0A 100%)', // Neutral-900 to a very dark neutral (almost black)
        // Example of using your primary color for a hero section gradient if needed elsewhere
        // 'hero-gradient': 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%)',
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#083344',
        },
        success: colors.green, // e.g., bg-success-500
        warning: colors.amber, // e.g., bg-warning-500
        error: colors.red,     // e.g., bg-error-500
        
        // Using Tailwind's neutral palette (e.g., Slate) for general UI elements
        // This is good for text, borders, and subtle UI backgrounds that are not the main page background
        neutral: colors.slate, // You can change slate to gray, zinc, stone etc.
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};