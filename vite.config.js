import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const repoName = process.env.GITHUB_REPOSITORY?.split("/").pop();

export default defineConfig({
  base: repoName ? `/${repoName}/` : "/",
  plugins: [react()],
});
