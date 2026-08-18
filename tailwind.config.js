/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070b14",
        surface: {
          50: "#0b1220",
          100: "#0f172a",
          200: "#131f37",
          300: "#1e293b",
          400: "#334155",
        },
        navy: {
          800: "#0a1329",
          900: "#060d1f",
          950: "#030712",
        },
        brand: {
          cyan: "#06b6d4",
          teal: "#14b8a6",
          blue: "#0ea5e9",
          indigo: "#6366f1",
          emerald: "#10b981",
          violet: "#8b5cf6",
        },
        accent: {
          glow: "rgba(6, 182, 212, 0.15)",
          border: "rgba(255, 255, 255, 0.08)",
          subtle: "rgba(255, 255, 255, 0.03)",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "Inter", "system-ui", "sans-serif"],
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
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 10px rgba(6,182,212,0.3))' },
          '100%': { opacity: '0.9', filter: 'drop-shadow(0 0 25px rgba(6,182,212,0.6))' },
        }
      },
      backgroundImage: {
        'radial-gradient-hero': 'radial-gradient(circle at 50% 30%, rgba(14, 165, 233, 0.12) 0%, rgba(99, 102, 241, 0.05) 45%, transparent 70%)',
        'radial-gradient-card': 'radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.08) 0%, transparent 60%)',
      }
    },
  },
  plugins: [],
}
