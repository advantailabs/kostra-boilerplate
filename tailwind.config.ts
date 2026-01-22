// Note: In Tailwind v4, configuration is done via CSS @theme directive
// This file is kept for reference but plugins are configured differently in v4
// tailwind-scrollbar is not compatible with Tailwind v4 and has been removed
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'selector',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  // Theme configuration has been moved to @theme in globals.css
  // Plugins for v4 may need different configuration - check plugin compatibility
  plugins: [forms, typography],
};
export default config;
