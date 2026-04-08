import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const liveServerJs = path.join(rootDir, "node_modules/live-server/live-server.js");

const watchFiles = [
  "index.html",
  "privacy.html",
  "site-use.html",
  "robots.txt",
  "sitemap.xml",
  "mary-hero.png",
  "mary-in-chair-lettering.png",
  "mary-hero.svg",
  "favicon.svg",
  "social-share.svg",
];

function debounce(fn, ms) {
  let t;
  return () => {
    clearTimeout(t);
    t = setTimeout(fn, ms);
  };
}

const port = Number(process.env.PORT) || 3000;
const siteUrl = `http://127.0.0.1:${port}`;

function runBuild() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["scripts/build.mjs"], {
      cwd: rootDir,
      env: { ...process.env, SITE_URL: siteUrl },
      stdio: "inherit",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`build exited with code ${code}`));
    });
  });
}

await runBuild();

if (!fs.existsSync(liveServerJs)) {
  console.error("Missing live-server. Run: npm install");
  process.exit(1);
}

const server = spawn(process.execPath, [liveServerJs, "--host=0.0.0.0", "--no-browser", "dist"], {
  cwd: rootDir,
  env: { ...process.env, PORT: String(port) },
  stdio: "inherit",
});

const rebuild = debounce(async () => {
  try {
    console.log("\n[dev] Rebuilding…");
    await runBuild();
  } catch (e) {
    console.error("[dev] Build failed:", e.message);
  }
}, 200);

for (const file of watchFiles) {
  const fp = path.join(rootDir, file);
  if (!fs.existsSync(fp)) continue;
  fs.watch(fp, rebuild);
}

function shutdown() {
  if (server && !server.killed) server.kill("SIGTERM");
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

server.on("exit", (code) => process.exit(code ?? 0));
