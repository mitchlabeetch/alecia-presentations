Alecia Presentations/tailwind.config.js
```

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        alecia: {
          navy: {
            DEFAULT: '#0a1628',
            light: '#1a2a42',
            lighter: '#2a3a52',
            dark: '#050d18',
          },
          gold: {
            DEFAULT: '#c9a84c',
            light: '#d4b76a',
            lighter: '#dfc688',
            dark: '#b8973d',
          },
          pink: {
            DEFAULT: '#e91e63',
            light: '#f06292',
            dark: '#c2185b',
            50: '#fce4ec',
            100: '#f8bbd9',
            200: '#f48fb1',
            300: '#f06292',
            400: '#ec407a',
            500: '#e91e63',
            600: '#d81b60',
            700: '#c2185b',
            800: '#ad1457',
            900: '#880e4f',
          },
          gray: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'alecia-gradient': 'linear-gradient(135deg, #0a1628 0%, #1a2a42 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'alecia': '0 4px 20px rgba(10, 22, 40, 0.15)',
        'alecia-lg': '0 10px 40px rgba(10, 22, 40, 0.2)',
        'alecia-gold': '0 4px 20px rgba(201, 168, 76, 0.3)',
        'alecia-pink': '0 4px 20px rgba(233, 30, 99, 0.3)',
      },
    },
  },
  plugins: [],
};
