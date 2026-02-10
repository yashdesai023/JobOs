/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#030305',      // Deeper than black, slightly violet
        panel: '#0C0C10',     // UI panel color
        aurora: {
          purple: '#7c3aed',
          fuchsia: '#db2777',
          cyan: '#06b6d4',
        },
        primary: '#f8fafc', // Almost white text
        secondary: '#94a3b8', // Slate grey text
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(to right bottom, #7c3aed, #db2777)',
        'gradient-subtle': 'radial-gradient(circle at center, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'aurora-shift': 'aurora-shift 10s ease-in-out infinite alternate',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'aurora-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
