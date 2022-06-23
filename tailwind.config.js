/** @type {import('tailwindcss').Config} */
/**
 * TODO: add theme to follow the branding rules of Northeastern
 * https://brand.northeastern.edu/visual-design/typography/
 */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx}",
		"./src/components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				"northeastern-red": "#C8102E",
			},
		},
	},
	plugins: [
		require("@tailwindcss/forms"),
		// ...
	],
};
