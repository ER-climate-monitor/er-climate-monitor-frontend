/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                pastelViolet: '#574964',
                primary: '#81D8D0',
                secondary: '#D99E82',
                third: '#D7D982',
                fourth: '#AE82D9',
            },
            fontFamily: {
                'material-symbols': ['Material Symbols Outlined'],
            },
        },
    },
    plugins: [],
};
