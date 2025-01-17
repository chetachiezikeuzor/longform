import svelte from "rollup-plugin-svelte";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sveltePreprocess from "svelte-preprocess";
import copy from "rollup-plugin-copy";
import { env } from "process";

const isProd = env.BUILD === "production";
const isWatching = env.ROLLUP_WATCH === "true";
const pluginDir = env.PLUGINS_DIR;

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/
`;

export default {
  input: "src/main.ts",
  output: {
    dir: ".",
    sourcemap: !isProd,
    format: "cjs",
    exports: "default",
    banner,
  },
  external: ["obsidian"],
  plugins: [
    svelte({
      emitCss: false,
      preprocess: sveltePreprocess(),
    }),
    typescript({
      sourceMap: !isProd,
      inlineSources: !isProd,
      rootDir: "./src",
    }),
    nodeResolve({ browser: true, dedupe: ["svelte"] }),
    commonjs({
      include: "node_modules/**",
    }),
    isWatching &&
      pluginDir &&
      copy({
        targets: [
          {
            src: ["main.js", "manifest.json", "styles.css"],
            dest: pluginDir + "/longform/",
          },
        ],
        hook: "writeBundle",
        verbose: true,
        overwrite: true,
      }),
  ],
};
