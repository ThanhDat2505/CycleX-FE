/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // CycleX Brand Colors
                'brand-bg': '#1A2332',           // Dark navy background
                'brand-primary': '#FF6B00',      // CycleX orange
                'brand-primary-hover': '#E55F00', // Darker orange on hover
                'brand-text': '#1F2937',         // Dark gray text (gray-800)
                'brand-text-light': '#6B7280',   // Light gray text (gray-500)
                'brand-border': '#D1D5DB',       // Border gray (gray-300)
                'brand-error': '#DC2626',        // Error red (red-600)
                'brand-success': '#10B981',      // Success green (green-500)
            },
        },
    },
    plugins: [],
};