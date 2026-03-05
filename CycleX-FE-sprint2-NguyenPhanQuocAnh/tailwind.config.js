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
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
                'glow': '0 0 15px rgba(59, 130, 246, 0.5)', // Blue glow
                'glow-orange': '0 0 15px rgba(255, 107, 0, 0.5)', // Orange glow
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'slide-in-right': {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                shrink: {
                    '0%': { width: '100%' },
                    '100%': { width: '0%' },
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'fade-in-up': 'slideUp 0.6s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'scale-in': 'scaleIn 0.3s ease-out forwards',
                'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'shrink': 'shrink linear forwards',
            },
        },
    },
    plugins: [],
};