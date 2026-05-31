import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import prefixWrap from "postcss-prefixwrap";

export default defineConfig({
    plugins: [
        react(),
        dts({ tsconfigPath: resolve(__dirname, "tsconfig.lib.json") }),
    ],

    css: {
        postcss: {
            plugins: [
                prefixWrap(".eqv-trans-checker", {
                    blacklist: ["bootstrap.min.css"],
                }),
            ],
        },
    },

    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            formats: ["es", "umd"],
            name: "EqvTransChecker",
            fileName: (format) => `eqv-trans-checker.${format}.js`,
        },

        rollupOptions: {
            external: ["react", "react-dom"],

            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
    },
});