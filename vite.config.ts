import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import packageJson from "./package.json";
import svgr from "vite-plugin-svgr";
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';
// ----------------------------------------------------------------------
export default defineConfig(({ mode }) => {
  return {
    base: "",
    publicDir: false,
    plugins: [svgr(), react(), nodePolyfills(), tsconfigPaths()],
    define: {
      "import.meta.env.NAME": JSON.stringify(packageJson.title),
      "import.meta.env.VERSION": JSON.stringify(packageJson.version),
      "import.meta.env.PORT": JSON.stringify(3007),
      "import.meta.env.SERVERPORT": JSON.stringify(8081),
    },
    build: {
      manifest: true,
      sourcemap: false,
    },
    esbuild: {
      pure: mode === 'production'? ['console.log']: [],
    },
    server: {
      port: 3007,
    },
  };
});
