

import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname =
    typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  async viteFinal(baseConfig) {
    return {
        ...baseConfig,
        resolve: {
            ...baseConfig.resolve,
            alias: {
                ...baseConfig.resolve?.alias,
                "@": path.resolve(dirname, "../src"),
            },
        },
    };
  }
};
export default config;
