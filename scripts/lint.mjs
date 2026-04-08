import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const distDir = path.join(rootDir, "dist");

const requiredFiles = [
  "index.html",
  "privacy.html",
  "site-use.html",
  "robots.txt",
  "sitemap.xml",
  "mary-hero.png",
  "favicon.svg",
];

for (const file of requiredFiles) {
  await access(path.join(distDir, file));
}

const indexHtml = await readFile(path.join(distDir, "index.html"), "utf8");
const privacyHtml = await readFile(path.join(distDir, "privacy.html"), "utf8");
const siteUseHtml = await readFile(path.join(distDir, "site-use.html"), "utf8");
const robotsTxt = await readFile(path.join(distDir, "robots.txt"), "utf8");
const sitemapXml = await readFile(path.join(distDir, "sitemap.xml"), "utf8");

const builtFiles = [indexHtml, privacyHtml, siteUseHtml, robotsTxt, sitemapXml];

if (builtFiles.some((file) => file.includes("__SITE_URL__"))) {
  throw new Error("Build output still contains unresolved __SITE_URL__ placeholders.");
}

const checks = [
  [indexHtml.includes('<link rel="canonical" href="https://'), "Homepage canonical is missing or not absolute."],
  [indexHtml.includes('property="og:url" content="https://'), "Homepage og:url is missing or not absolute."],
  [robotsTxt.includes("Sitemap: https://"), "robots.txt sitemap is missing or not absolute."],
  [sitemapXml.includes("<loc>https://"), "sitemap.xml URLs are missing or not absolute."],
];

for (const [passed, message] of checks) {
  if (!passed) {
    throw new Error(message);
  }
}

console.log("Lint passed for built static output.");
