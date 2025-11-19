/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#0F172A", // Slate 900
                    foreground: "#F8FAFC", // Slate 50
                },
                secondary: {
                    DEFAULT: "#F1F5F9", // Slate 100
                    foreground: "#0F172A", // Slate 900
                },
                accent: {
                    DEFAULT: "#F97316", // Orange 500
                    foreground: "#FFFFFF",
                },
                destructive: {
                    DEFAULT: "#EF4444", // Red 500
                    foreground: "#FFFFFF",
                },
                muted: {
                    DEFAULT: "#F1F5F9", // Slate 100
                    foreground: "#64748B", // Slate 500
                },
                card: {
                    DEFAULT: "#FFFFFF",
                    foreground: "#0F172A",
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
