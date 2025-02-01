/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                pastelViolet: {
                    DEFAULT: '#574964',
                    50: '#F0EAF2',
                    100: '#D9D0E0',
                    200: '#C2B6CE',
                    300: '#AB9CBC',
                    400: '#9482AA',
                    500: '#574964',
                    600: '#463A52',
                    700: '#352B40',
                    800: '#241C2E',
                    900: '#130D1C',
                },
                primary: '#81D8D0',
                secondary: '#D99E82',
                third: '#D7D982',
                fourth: '#AE82D9',
            },
        },
    },
    plugins: [],
};
