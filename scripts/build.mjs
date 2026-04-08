import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const distDir = path.join(rootDir, "dist");

const templateFiles = [
  "index.html",
  "privacy.html",
  "site-use.html",
  "robots.txt",
  "sitemap.xml",
];

const assetFiles = [
  "mary-hero.png",
  "mary-in-chair-lettering.png",
  "mary-hero.svg",
  "favicon.svg",
  "social-share.svg",
];

function normalizeUrl(value) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, "");
}

function resolveSiteUrl() {
  const candidates = [
    process.env.SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ].filter(Boolean);

  if (candidates.length === 0) {
    throw new Error(
      "Missing site URL env var. Set SITE_URL or provide VERCEL_PROJECT_PRODUCTION_URL / VERCEL_URL before building.",
    );
  }

  return normalizeUrl(candidates[0]);
}

const siteUrl = resolveSiteUrl();

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

for (const file of templateFiles) {
  const sourcePath = path.join(rootDir, file);
  const outputPath = path.join(distDir, file);
  const template = await readFile(sourcePath, "utf8");
  const output = template.replaceAll("__SITE_URL__", siteUrl);
  await writeFile(outputPath, output);
}

for (const file of assetFiles) {
  const sourcePath = path.join(rootDir, file);
  const outputPath = path.join(distDir, file);
  await cp(sourcePath, outputPath, { force: true });
}

console.log(`Built static site to ${distDir}`);
console.log(`Using site URL: ${siteUrl}`);
