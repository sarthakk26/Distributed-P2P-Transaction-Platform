import type { Config } from 'tailwindcss';

export default {
  content: [
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./app/**/*.{ts,tsx,js,jsx}",
    // 👇 THIS is the important part — include UI package
    "../../packages/ui/src/**/*.{ts,tsx,js,jsx}"
  ],
} satisfies Config;
