/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}'
	],
	theme: {
		extend: {
			borderColor: {
				'grey-custom': 'rgba(69, 72, 80, 0.5)'
			},
			borderWidth: {
				1: '1px'
			},
			colors: {
				'dark-blue': '#252329',
				'secondary-blue': '#1D4ED8',
				'white-custom': '#E0E0E0',
				'white-svg': '#828282',
				'grey-custom': '#828282'
			},
			width: {
				100: '25rem'
			}
		}
	},
	plugins: []
};
