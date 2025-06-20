
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        body: ['PT Sans', 'sans-serif'],
        headline: ['PT Sans', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background-hsl))', // Use HSL var from :root
        foreground: 'hsl(var(--foreground-hsl))', // Use HSL var from :root
        card: {
          DEFAULT: 'hsl(var(--card-hsl))',
          foreground: 'hsl(var(--card-foreground-hsl))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover-hsl))',
          foreground: 'hsl(var(--popover-foreground-hsl))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary-h) var(--primary-s) var(--primary-l))',
          foreground: 'hsl(var(--primary-foreground-h) var(--primary-foreground-s) var(--primary-foreground-l))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary-h) var(--secondary-s) var(--secondary-l))',
          foreground: 'hsl(var(--secondary-foreground-h) var(--secondary-foreground-s) var(--secondary-foreground-l))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted-hsl))',
          foreground: 'hsl(var(--muted-foreground-hsl))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent-h) var(--accent-s) var(--accent-l))',
          foreground: 'hsl(var(--accent-foreground-h) var(--accent-foreground-s) var(--accent-foreground-l))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive-h) var(--destructive-s) var(--destructive-l))',
          foreground: 'hsl(var(--destructive-foreground-h) var(--destructive-foreground-s) var(--destructive-foreground-l))',
        },
        border: 'hsl(var(--border-hsl))',
        input: 'hsl(var(--input-hsl))',
        ring: 'hsl(var(--primary-h) var(--primary-s) var(--primary-l))', 
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background-hsl))',
          foreground: 'hsl(var(--sidebar-foreground-hsl))',
          primary: 'hsl(var(--sidebar-primary-hsl))', // Updated to use HSL components
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground-hsl))',
          accent: 'hsl(var(--sidebar-accent-hsl))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground-hsl))',
          border: 'hsl(var(--sidebar-border-hsl))',
          ring: 'hsl(var(--sidebar-ring-hsl))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
