/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Alecia Brand Colors - from color_palette_analysis.json
        alecia: {
          navy: '#061a40',        // Primary background, dominant text (946 uses)
          red: '#b80c09',         // Primary accent, highlights (35 uses)
          'dark-blue': '#0a2a68', // Secondary, sub-sections (23 uses)
          silver: '#aab1be',      // Table headers, borders (21 uses)
          'off-white': '#fafafc', // Card/panel backgrounds (49 uses)
          'light-gray': '#ecf0f6', // Light gray background (13 uses)
          'table-stripe': '#e6e8ec', // Table stripe alternative (13 uses)
          'red-variant': '#c00000', // Negative indicators (11 uses)
          green: '#92d050',       // Positive KPI indicators (8 uses)
          // Secondary/functional palette
          'medium-blue': '#749ac7',
          'deep-navy': '#163e64',
          'light-blue': '#bfd7ea',
          'very-light-red': '#fee9e8',
          'strategy-blue': '#4370a7',
          'lightest-blue': '#e3f2fd',
          'darkest-navy': '#0e2841',
        },
      },
      fontFamily: {
        // Bierstadt for presentation content, Inter for UI chrome
        bierstadt: ['Bierstadt', 'Arial', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // Spacing tokens from ALECIA_DESIGN_SYSTEM.md
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '20': '20px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
      },
      borderRadius: {
        // Border radius tokens
        '4': '4px',
        '6': '6px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(6, 26, 64, 0.08)',
        'card-hover': '0 4px 16px rgba(6, 26, 64, 0.12)',
        'modal': '0 8px 32px rgba(6, 26, 64, 0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
