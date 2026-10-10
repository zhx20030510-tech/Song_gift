import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const normalizeBase = (value?: string) => {
  const trimmed = (value ?? "").trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}/` : "/";
};

export default defineConfig({
  base: normalizeBase(process.env.BASE_PATH),
  plugins: [react()],
});
