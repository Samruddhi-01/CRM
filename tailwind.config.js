/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B2F6B',
        accent: '#D20B2B',
        cta: '#1F8BFF',
        surface: '#FFFFFF',
        bg: '#F2F5F9',
        text: '#1F2937',
        muted: '#6B7280',
        border: '#E5E7EB',
        active: '#16A34A',
        inactive: '#D20B2B',
        pending: '#FACC15',
        later: '#1F8BFF',
        success: '#16A34A',
        danger: '#D20B2B',
        warning: '#F59E0B'
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0,0,0,0.04)',
        'soft': '0 2px 6px -1px rgba(0,0,0,0.06), 0 4px 12px -2px rgba(0,0,0,0.05)',
        'morph': '0 4px 16px rgba(11,47,107,0.15)',
        'glass': '0 8px 24px rgba(11,47,107,0.20)',
        'focus': '0 0 0 3px rgba(31,139,255,0.4)'
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
        '11': '44px',
        '12': '48px'
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        'pill': '999px'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideIn: { '0%': { transform: 'translateY(12px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: .6 } }
      },
      animation: {
        fadeIn: 'fadeIn .35s ease-out',
        slideIn: 'slideIn .4s cubic-bezier(0.33,1,0.68,1)',
        pulseSoft: 'pulseSoft 2.5s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}

