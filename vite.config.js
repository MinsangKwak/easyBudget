import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dirname =
    typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const isGithubPages = process.env.GITHUB_ACTIONS === "true";
const basePath = isGithubPages ? "./" : "/";

const copyIndexTo404 = () => ({
    name: "copy-index-to-404",
    closeBundle() {
        const distDir = path.resolve(dirname, "dist");
        const indexPath = path.join(distDir, "index.html");
        const fallbackPath = path.join(distDir, "404.html");

        if (fs.existsSync(indexPath)) {
            fs.copyFileSync(indexPath, fallbackPath);
        }
    },
});

export default defineConfig({
    base: "/easyBudget/",
    plugins: [react(), copyIndexTo404()],
    test: {
        projects: [
            {
                extends: true,
                plugins: [
                    storybookTest({
                        configDir: path.join(dirname, ".storybook"),
                    }),
                ],
                test: {
                    name: "storybook",
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright({}),
                        instances: [{ browser: "chromium" }],
                    },
                    setupFiles: [".storybook/vitest.setup.js"],
                },
            },
        ],
    },
});
