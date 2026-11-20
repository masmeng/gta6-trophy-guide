// Leonida Trophy Guide — tiny static server for local use.
//
// Serves app/ at its root on port 8080 so the guide can be tried in a
// desktop browser. Node 22 standard library only.
//
//   node serve.ts
//   -> http://localhost:8080

import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = resolve(join(new URL('.', import.meta.url).pathname, 'app'));
const port = Number(process.env.PORT ?? 8080);

const mimeByExt: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = createServer((req, res) => {
  const raw = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  const target = resolve(join(appDir, normalize(raw).replace(/^(\.\.[/\\])+/, '')));
  const file = target === appDir ? join(appDir, 'index.html') : target;
  if (!file.startsWith(appDir) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('not found\n');
    return;
  }
  res.writeHead(200, { 'content-type': mimeByExt[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
});

server.listen(port, () => {
  console.log(`serve.ts: Leonida Trophy Guide at http://localhost:${port}`);
});
