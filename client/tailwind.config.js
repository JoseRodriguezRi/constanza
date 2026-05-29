/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0F1117',
        card: '#1A1F2E',
        border: '#2A3045',
        primary: '#00C48C',
        amber: '#F5A623',
        lavender: '#6C8EF5',
        'primary-dark': '#00A376',
        'card-hover': '#222840',
      },
      fontFamily: {
        title: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
