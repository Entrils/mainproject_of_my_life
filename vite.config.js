import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/mainproject_of_my_life/", // ← ВАЖНО
  assetsInclude: ["**/*.PNG", "**/*.JPG", "**/*.JPEG", "**/*.MP4", "**/*.MP3"],
});