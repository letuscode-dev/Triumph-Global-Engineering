import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// Flat config (ESLint 9 / Next.js 16). `next lint` was removed in Next 16, so
// linting runs via the ESLint CLI: `npm run lint`.
const config = [
  {
    ignores: ["playwright-report/**", "test-results/**", ".playwright/**"],
  },
  ...nextCoreWebVitals,
];

export default config;
