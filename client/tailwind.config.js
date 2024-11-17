// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lightBlue: {
          400: '#ADD8E6', // Light blue color
        },
        peach: {
          400: '#FFDAB9', // Peach color
        },
      },
    },
  },
  plugins: [require("daisyui")], // Add this line
};
