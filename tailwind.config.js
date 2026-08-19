/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050816",
        midnight: {
          950: "#050816",
          900: "#0B1224",
          850: "#0F172E",
          800: "#131F3B",
        },
        surface: {
          50: "#0B1224",
          100: "#0F172E",
          200: "#14213D",
          300: "#1E293B",
          400: "#334155",
        },
        navy: {
          800: "#0B1224",
          900: "#050816",
          950: "#030612",
        },
        brand: {
          cyan: "#16C7F3",
          teal: "#2DD4BF",
          mint: "#8BE6D0",
          lavender: "#9B8CFF",
          blue: "#0EA5E9",
          indigo: "#6366F1",
          emerald: "#10B981",
          rose: "#F43F5E",
          amber: "#F59E0B",
        },
        section: {
          dark: "#050816",
          darkAlt: "#0B1224",
          offwhite: "#F8FAFC",
          warmWhite: "#F1F5F9",
          softBlue: "#F0F7FF",
          softLavender: "#F8F7FF",
          softMint: "#F0FDF9",
          lightGray: "#F4F6F9",
        },
        accent: {
          glow: "rgba(22, 199, 243, 0.15)",
          border: "rgba(255, 255, 255, 0.08)",
          subtle: "rgba(255, 255, 255, 0.03)",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["Outfit", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 10px rgba(22,199,243,0.3))' },
          '100%': { opacity: '0.9', filter: 'drop-shadow(0 0 25px rgba(22,199,243,0.6))' },
        }
      },
      backgroundImage: {
        'radial-gradient-hero': 'radial-gradient(circle at 50% 30%, rgba(22, 199, 243, 0.12) 0%, rgba(155, 140, 255, 0.06) 45%, transparent 70%)',
        'radial-gradient-card': 'radial-gradient(circle at 80% 20%, rgba(22, 199, 243, 0.08) 0%, transparent 60%)',
      }
    },
  },
  plugins: [],
}
