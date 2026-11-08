import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// These are prototype fixture signatures, not real provider URLs. This is a
// regression check for the current catalog, not a general-purpose secret scanner.
const forbidden = [
  ['internal link marker', /lnk-/i],
  ['synthetic internal movie ID', /\bfixture-\d{3}\b/i],
  ['fixture destination URL', /https?:[/\\]+(?:alpha|beta)\.example\.com[/\\]+/i],
  ['private quality target key', /\bq-(?:480|720-hevc|720-x264|1080-hevc|1080-x264|hq-1080)\b/i],
];
const failures = [];

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : entry.isFile() ? [path] : [];
  });
}

const assetRoot = '.next/static';
const pageRoot = '.next/server/app';
if (!existsSync(assetRoot) || !existsSync(pageRoot)) {
  failures.push('Production build not found. Run npm run build before this check.');
}
const assets = existsSync(assetRoot) ? walk(assetRoot) : [];
const pages = existsSync(pageRoot)
  ? walk(pageRoot).filter((file) => /\.(?:html|rsc)$/.test(file))
  : [];
if (!assets.length || !pages.length) failures.push('Build output is incomplete or empty.');

for (const file of [...assets, ...pages]) {
  const text = readFileSync(file, 'utf8');
  for (const [name, pattern] of forbidden) {
    if (pattern.test(text)) failures.push(`${name} found in public build file: ${file}`);
  }
}

const serverModule = 'src/lib/link-fixtures.ts';
if (
  !existsSync(serverModule) ||
  !/^\s*import\s+['"]server-only['"];?/m.test(readFileSync(serverModule, 'utf8'))
) {
  failures.push('Server fixture module must retain the Next.js server-only marker.');
}

const report = {
  checkedAt: new Date().toISOString(),
  scope: 'Production static assets and generated public HTML/RSC payloads',
  staticAssets: assets.length,
  generatedPayloads: pages.length,
  failures,
  status: failures.length === 0 ? 'pass' : 'fail',
};
mkdirSync('.artifacts/phase2', { recursive: true });
writeFileSync('.artifacts/phase2/public-boundary.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
