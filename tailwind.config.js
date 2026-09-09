/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050814",
        midnight: {
          950: "#050814",
          900: "#070B17",
          850: "#0B1220",
          800: "#0E1626",
          700: "#111C2E",
        },
        surface: {
          50: "#070B17",
          100: "#0B1220",
          200: "#0E1626",
          300: "#111C2E",
          400: "#1E293B",
          500: "#334155",
        },
        navy: {
          800: "#0E1626",
          900: "#070B17",
          950: "#050814",
        },
        brand: {
          cyan: "#19C7F3",
          cyanBright: "#4DD8FF",
          teal: "#2DD4BF",
          mint: "#8BE6D0",
          blue: "#0EA5E9",
          indigo: "#6366F1",
          emerald: "#34D399",
          rose: "#FB7185",
          amber: "#F59E0B",
        },
        section: {
          dark: "#050814",
          darkAlt: "#070B17",
          surface: "#0B1220",
          elevated: "#0E1626",
          interactive: "#111C2E",
        },
        ops: {
          bg: "#050814",
          bgSecondary: "#070B17",
          surfaceDark: "#0B1220",
          surfaceDarkElevated: "#0E1626",
          surfaceInteractive: "#111C2E",
          borderDark: "rgba(255, 255, 255, 0.08)",
          borderDarkStrong: "rgba(255, 255, 255, 0.14)",
          cyan: "#19C7F3",
          cyanBright: "#4DD8FF",
          cyanMuted: "rgba(25, 199, 243, 0.12)",
          teal: "#2DD4BF",
          amber: "#F59E0B",
          rose: "#FB7185",
          emerald: "#34D399",
        },
        accent: {
          glow: "rgba(25, 199, 243, 0.08)",
          border: "rgba(255, 255, 255, 0.08)",
          borderStrong: "rgba(255, 255, 255, 0.14)",
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
