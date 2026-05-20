/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ─── Color Palette ───────────────────────────────────────────
      colors: {
        espresso:    '#3D1B11',
        'flame-orange': '#E25222',
        'warm-cream':   '#FBF7F2',
        mustard:     '#F3C641',
        'soft-sand': '#F3EDE2',
        'muted-taupe': '#756A63',
        // shades
        'flame-dark':   '#C43D15',
        'mustard-dark': '#E8B020',
      },

      // ─── Typography ──────────────────────────────────────────────
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans:    ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['5rem',   { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl':  ['3.75rem',{ lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg':  ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-md':  ['1.75rem',{ lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      fontWeight: {
        black: '900',
      },
      lineHeight: {
        tight:   '1.1',
        snug:    '1.2',
        relaxed: '1.6',
      },
      letterSpacing: {
        wider: '0.08em',
      },

      // ─── Spacing ─────────────────────────────────────────────────
      maxWidth: {
        container: '1200px',
      },
      spacing: {
        18: '4.5rem',   // 72px
        22: '5.5rem',   // 88px
        30: '7.5rem',   // 120px
      },

      // ─── Border Radius ───────────────────────────────────────────
      borderRadius: {
        sm:  '8px',
        md:  '12px',
        lg:  '16px',
        xl:  '24px',
      },

      // ─── Box Shadow ──────────────────────────────────────────────
      boxShadow: {
        card: '0 2px 8px rgba(61, 27, 17, 0.08)',
      },

      // ─── Background Gradients ────────────────────────────────────
      backgroundImage: {
        'cta-gradient':     'linear-gradient(135deg, #E25222 0%, #C43D15 100%)',
        'mustard-gradient': 'linear-gradient(135deg, #F3C641 0%, #E8B020 100%)',
      },

      // ─── Animation ───────────────────────────────────────────────
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
