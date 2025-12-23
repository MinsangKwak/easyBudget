import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname =
    typeof __dirname !== "undefined"
        ? __dirname
        : path.dirname(fileURLToPath(import.meta.url));

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
<<<<<<< HEAD
    stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

    addons: [
        "@chromatic-com/storybook",
        "@storybook/addon-vitest",
        "@storybook/addon-a11y",
        "@storybook/addon-docs",
    ],

    framework: {
        name: "@storybook/react-vite",
        options: {},
    },

    async viteFinal(baseConfig) {
        return {
            ...baseConfig,

            base: "/",

            server: {
                ...(baseConfig.server ?? {}),

                // 🔴 핵심 1: Codespaces 서브도메인 명시 허용
                allowedHosts: [
                    ".app.github.dev",
                    "localhost",
                ],

                // 🔴 핵심 2: iframe + HMR 안정화
                host: true,

                // 🔴 핵심 3: preview iframe이 정확한 origin을 알도록
                origin: "http://localhost:6006",
=======
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
>>>>>>> f123035b1338a964eff1ada960e350af18a0cca3
            },

            resolve: {
                ...baseConfig.resolve,
                alias: {
                    ...baseConfig.resolve?.alias,
                    "@": path.resolve(dirname, "../src"),
                },
            },
        };
    },
};

export default config;
