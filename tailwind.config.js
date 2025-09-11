module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dhl-yellow': '#FFCC00',
        'dhl-red': '#D40511',
      },
      // CHANGED: Set 'Inter' as the default sans-serif font for readability
      // Kept 'Delivery' available for use on specific headings for branding
      fontFamily: {
        sans: ['"Inter"', 'Aptos', 'Arial', 'sans-serif'],
        delivery: ['"Delivery"', 'Aptos', 'Arial', 'sans-serif'],
      },
      screens: {
        // Mobile (iPhone SE): 375 × 667 px
        mobile: '375px',
        // Laptop screen: 1528 × 740 px
        laptop: '1528px',
        // Large monitor: 1912 × 1074 px
        large: '1912px',
      },
    },
  },
  plugins: [],
}
