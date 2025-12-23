import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const dirname =
    typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

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

export default defineConfig(() => {
    const isStorybook = process.env.STORYBOOK === "true";
    const isGithubPages = process.env.GITHUB_ACTIONS === "true";

    // ✅ 앱 배포(GH Pages)에서는 /easyBudget/
    // ✅ Storybook에서는 항상 / (루트)로 고정해야 preview 로딩 404가 안 남
    const base = isStorybook ? "/" : isGithubPages ? "/easyBudget/" : "/";

    return {
        base,
        plugins: [react(), copyIndexTo404()],

        // ✅ Codespaces 포함 원격 환경에서 dev server 안정화
        server: {
            host: true,
            strictPort: false,
            allowedHosts: "all",
        },
    };
});
