import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname =
    typeof __dirname !== "undefined"
        ? __dirname
        : path.dirname(fileURLToPath(import.meta.url));

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
    // mdx를 실제로 안 쓰면 ../src/**/*.mdx 줄은 지워도 됨 (경고 줄이기)
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

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

            // Storybook preview 경로 꼬임 방지
            base: "/",

            // Codespaces(외부 호스트) 접근 허용 + HMR 안정화
            server: {
                ...(baseConfig.server ?? {}),
                host: true,
                allowedHosts: [".app.github.dev", "localhost"],
                // origin은 대부분 불필요해서 빼는 걸 추천.
                // 넣고 싶으면 실제 접속 도메인/포트와 정확히 맞춰야 함.
            },

            resolve: {
                ...baseConfig.resolve,
                alias: {
                    ...(baseConfig.resolve?.alias ?? {}),
                    "@": path.resolve(dirname, "../src"),
                },
            },
        };
    },
};

export default config;
