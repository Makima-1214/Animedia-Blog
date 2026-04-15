/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'secondary': '#576068',
        'on-secondary-container': '#4a535a',
        'secondary-fixed-dim': '#ccd5de',
        'surface-container-lowest': '#ffffff',
        'surface-tint': '#0057ce',
        'tertiary': '#605c78',
        'on-tertiary-fixed': '#3e3a54',
        'error': '#9f403d',
        'surface-container-highest': '#d7e4f2',
        'primary': '#0057ce',
        'on-secondary-fixed': '#384048',
        'primary-fixed-dim': '#c5d4ff',
        'surface': '#f7f9ff',
        'primary-dim': '#004cb6',
        'surface-container-low': '#eff4fc',
        'surface-dim': '#ccdcec',
        'error-dim': '#4e0309',
        'tertiary-dim': '#54506b',
        'on-error': '#fff7f6',
        'on-tertiary': '#fcf7ff',
        'surface-variant': '#d7e4f2',
        'on-primary-container': '#004bb4',
        'error-container': '#fe8983',
        'inverse-on-surface': '#9a9da2',
        'tertiary-fixed-dim': '#d5cdee',
        'on-error-container': '#752121',
        'surface-container': '#e7eff8',
        'surface-container-high': '#dfe9f5',
        'on-primary': '#f8f7ff',
        'secondary-container': '#dbe4ed',
        'on-surface': '#28343e',
        'secondary-fixed': '#dbe4ed',
        'on-surface-variant': '#54606c',
        'on-primary-fixed': '#003a8f',
        'inverse-surface': '#0b0f12',
        'on-secondary-fixed-variant': '#545d64',
        'on-background': '#28343e',
        'on-primary-fixed-variant': '#0054c8',
        'on-tertiary-container': '#514d68',
        'secondary-dim': '#4b545c',
        'on-tertiary-fixed-variant': '#5b5672',
        'primary-fixed': '#dae2ff',
        'outline-variant': '#a6b3c1',
        'tertiary-container': '#e3dbfd',
        'tertiary-fixed': '#e3dbfd',
        'inverse-primary': '#588cff',
        'background': '#f7f9ff',
        'primary-container': '#dae2ff',
        'outline': '#6f7c88',
        'on-secondary': '#f5f9ff',
        'surface-bright': '#f7f9ff'
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem'
      },
      fontFamily: {
        headline: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function({ addUtilities }) {
      addUtilities({
        '.no-scrollbar::-webkit-scrollbar': { display: 'none' },
        '.no-scrollbar': { '-ms-overflow-style': 'none', 'scrollbar-width': 'none' },
      })
    }
  ]
}
