import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('../', import.meta.url));
const run = (command, args, cwd = project, capture = false) => execFileSync(command, args, {
  cwd, stdio: capture ? 'pipe' : 'inherit', encoding: 'utf8',
});

run('npm', ['run', 'build']);
const remote = run('git', ['remote', 'get-url', 'origin'], project, true).trim();
const checkout = mkdtempSync(join(tmpdir(), 'portfolio-pages-'));
try {
  run('git', ['clone', '--depth', '1', '--branch', 'gh-pages', remote, checkout]);
  // Only clear the disposable deployment checkout; retain its branch history.
  for (const item of readdirSync(checkout)) {
    if (item !== '.git') rmSync(join(checkout, item), { recursive: true, force: true });
  }
  cpSync(join(project, 'dist'), checkout, { recursive: true });
  writeFileSync(join(checkout, '.nojekyll'), '');
  run('git', ['add', '--all'], checkout);
  if (run('git', ['status', '--porcelain'], checkout, true).trim()) {
    run('git', ['commit', '-m', 'Publish portfolio static build'], checkout);
    run('git', ['push', 'origin', 'HEAD:gh-pages'], checkout);
    console.log('Static build pushed. GitHub Pages will publish the gh-pages branch.');
  } else {
    console.log('The published branch already contains this build.');
  }
} finally {
  rmSync(checkout, { recursive: true, force: true });
}
