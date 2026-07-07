/** @type {import("@serwist/build").InjectManifestOptions} */
export default {
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  globDirectory: "public",
  globPatterns: ["**/*.{png,ico,webmanifest,json,svg}"],
  globIgnores: ["sw.js", "sw.js.map"],
};
