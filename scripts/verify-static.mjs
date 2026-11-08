import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const failures = [];
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const runtimeDependencies = Object.keys(pkg.dependencies ?? {});
if (runtimeDependencies.sort().join(',') !== 'next,react,react-dom') {
  failures.push(`Unexpected runtime dependencies: ${runtimeDependencies.join(', ')}`);
}
for (const path of [
  'src/app/api',
  'src/pages/api',
  'pages/api',
  'src/server/db',
  'src/server/auth',
]) {
  if (existsSync(path)) failures.push(`Forbidden Phase 2 integration path exists: ${path}`);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const sourceFiles = walk('src').filter((file) => /\.(ts|tsx)$/.test(file));
for (const file of sourceFiles) {
  const text = readFileSync(file, 'utf8');
  if (/\bfetch\s*\(|axios|XMLHttpRequest|WebSocket\s*\(/.test(text)) {
    failures.push(`Network call found in ${file}`);
  }
  if (
    /process\.env\.(DATABASE_URL|BETTER_AUTH_SECRET|TMDB_API_READ_TOKEN|CRON_SECRET)/.test(text)
  ) {
    failures.push(`Sensitive runtime configuration referenced in ${file}`);
  }
}

const report = {
  checkedAt: new Date().toISOString(),
  scope: 'Phase 2 static fixture boundary',
  runtimeDependencies,
  sourceFiles: sourceFiles.length,
  failures,
  status: failures.length === 0 ? 'pass' : 'fail',
};
mkdirSync('.artifacts/phase2', { recursive: true });
writeFileSync('.artifacts/phase2/static-boundary.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (failures.length > 0) process.exit(1);
