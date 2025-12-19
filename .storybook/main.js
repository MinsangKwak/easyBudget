

import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react-swc";

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
    const filteredPlugins = (baseConfig.plugins || []).filter(
        (plugin) => plugin?.name !== "vite:react" && plugin?.name !== "vite:react-swc",
    );

    return {
        ...baseConfig,
        plugins: [react(), ...filteredPlugins],
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
