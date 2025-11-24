/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {
      // allow scanning monorepo packages
      config: "./tailwind.config.ts",
    },
  },
};

export default config;
