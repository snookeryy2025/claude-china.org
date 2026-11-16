import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Next dev may automatically choose another port when one is occupied. Each
// running server must also have its own compiler output, otherwise its HTML,
// RSC payloads and browser bundles can come from different compilations.
const server = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'dev', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, NEXT_DIST_DIR: `.next-dev/session-${process.pid}` },
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.kill(signal));
}

server.on('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});

server.on('exit', (code, signal) => {
  process.exitCode = code ?? (signal === 'SIGINT' || signal === 'SIGTERM' ? 0 : 1);
});
