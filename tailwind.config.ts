import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import scrollbar from 'tailwind-scrollbar';
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'selector',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Use CSS variables for all colors
        gray: {
          50: 'var(--gray-50)',
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
          700: 'var(--gray-700)',
          800: 'var(--gray-800)',
          900: 'var(--gray-900)',
          950: 'var(--gray-950)',
        },
        indigo: {
          50: 'var(--indigo-50)',
          100: 'var(--indigo-100)',
          200: 'var(--indigo-200)',
          300: 'var(--indigo-300)',
          400: 'var(--indigo-400)',
          500: 'var(--indigo-500)',
          600: 'var(--indigo-600)',
          700: 'var(--indigo-700)',
          800: 'var(--indigo-800)',
          900: 'var(--indigo-900)',
          950: 'var(--indigo-950)',
        },
        red: {
          50: 'var(--red-50)',
          100: 'var(--red-100)',
          200: 'var(--red-200)',
          300: 'var(--red-300)',
          400: 'var(--red-400)',
          500: 'var(--red-500)',
          600: 'var(--red-600)',
          700: 'var(--red-700)',
          800: 'var(--red-800)',
          900: 'var(--red-900)',
          950: 'var(--red-950)',
        },
        green: {
          50: 'var(--green-50)',
          100: 'var(--green-100)',
          200: 'var(--green-200)',
          300: 'var(--green-300)',
          400: 'var(--green-400)',
          500: 'var(--green-500)',
          600: 'var(--green-600)',
          700: 'var(--green-700)',
          800: 'var(--green-800)',
          900: 'var(--green-900)',
          950: 'var(--green-950)',
        },
        yellow: {
          50: 'var(--yellow-50)',
          100: 'var(--yellow-100)',
          200: 'var(--yellow-200)',
          300: 'var(--yellow-300)',
          400: 'var(--yellow-400)',
          500: 'var(--yellow-500)',
          600: 'var(--yellow-600)',
          700: 'var(--yellow-700)',
          800: 'var(--yellow-800)',
          900: 'var(--yellow-900)',
          950: 'var(--yellow-950)',
        },
        cyan: {
          50: 'var(--cyan-50)',
          100: 'var(--cyan-100)',
          200: 'var(--cyan-200)',
          300: 'var(--cyan-300)',
          400: 'var(--cyan-400)',
          500: 'var(--cyan-500)',
          600: 'var(--cyan-600)',
          700: 'var(--cyan-700)',
          800: 'var(--cyan-800)',
          900: 'var(--cyan-900)',
          950: 'var(--cyan-950)',
        },
        purple: {
          50: 'var(--purple-50)',
          100: 'var(--purple-100)',
          200: 'var(--purple-200)',
          300: 'var(--purple-300)',
          400: 'var(--purple-400)',
          500: 'var(--purple-500)',
          600: 'var(--purple-600)',
          700: 'var(--purple-700)',
          800: 'var(--purple-800)',
          900: 'var(--purple-900)',
          950: 'var(--purple-950)',
        },
        emerald: {
          50: 'var(--emerald-50)',
          100: 'var(--emerald-100)',
          200: 'var(--emerald-200)',
          300: 'var(--emerald-300)',
          400: 'var(--emerald-400)',
          500: 'var(--emerald-500)',
          600: 'var(--emerald-600)',
          700: 'var(--emerald-700)',
          800: 'var(--emerald-800)',
          900: 'var(--emerald-900)',
          950: 'var(--emerald-950)',
        },
        white: 'var(--white)',
        black: 'var(--black)',
        // Semantic color mappings
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          hover: 'var(--secondary-hover)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          hover: 'var(--danger-hover)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          hover: 'var(--warning-hover)',
        },
        success: {
          DEFAULT: 'var(--success)',
          hover: 'var(--success-hover)',
        },
        info: {
          DEFAULT: 'var(--info)',
          hover: 'var(--info-hover)',
        },
        // Background colors
        background: {
          light: 'var(--bg-light)',
          DEFAULT: 'var(--bg)',
          dark: 'var(--bg-dark)',
        },
        // Text colors
        text: {
          light: 'var(--text-light)',
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
        },
        // Border colors
        border: {
          light: 'var(--border-light)',
          DEFAULT: 'var(--border)',
          muted: 'var(--border-muted)',
        },
        highlight: 'var(--highlight)',
      },
      keyframes: {
        hide: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        slideDownAndFade: {
          from: { opacity: '0', transform: 'translateY(-6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeftAndFade: {
          from: { opacity: '0', transform: 'translateX(6px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideUpAndFade: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideRightAndFade: {
          from: { opacity: '0', transform: 'translateX(-6px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        dialogOverlayShow: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        dialogContentShow: {
          from: {
            opacity: '0',
            transform: 'translate(-50%, -45%) scale(0.95)',
          },
          to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
        drawerSlideLeftAndFade: {
          from: { opacity: '0', transform: 'translateX(50%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        hide: 'hide 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideDownAndFade: 'slideDownAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade: 'slideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade: 'slideRightAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        drawerSlideLeftAndFade: 'drawerSlideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        dialogOverlayShow: 'dialogOverlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        dialogContentShow: 'dialogContentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [forms, typography, scrollbar({ nocompatible: true })],
};
export default config;
