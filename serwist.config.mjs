/** @type {import("@serwist/build").InjectManifestOptions} */
const config = {
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  globDirectory: "public",
  globPatterns: ["**/*.{png,ico,webmanifest,json,svg}"],
  globIgnores: ["sw.js", "sw.js.map"],
};

export default config;
