/**
 * Host half of the Clippy Companion plugin.
 *
 * The browser needs preset packs from `assets/<preset>/`: a `preset.json`
 * descriptor, a sprite sheet and its frame manifest. One read-only prefix
 * route exposes exactly that directory with traversal and type checks, so a
 * new pack is a directory plus a client-side registry entry.
 */
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ASSET_PREFIX = '/clippy-companion/assets';
const ASSET_ROOT = resolve(fileURLToPath(new URL('./assets/', import.meta.url)));
const CONTENT_TYPES = {
  '.png': 'image/png',
  '.json': 'application/json; charset=utf-8',
};

export const inject = ['webServer'];

export function apply(ctx) {
  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'prefix',
      path: ASSET_PREFIX,
      handler: async (request, response) => {
        if (request.method !== 'GET' && request.method !== 'HEAD') {
          response.setHeader('allow', 'GET, HEAD');
          response.statusCode = 405;
          response.end();
          return;
        }

        let pathname;
        try {
          pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://127.0.0.1').pathname);
        } catch (error) {
          response.statusCode = 400;
          response.end('bad request');
          return;
        }

        if (!pathname.startsWith(ASSET_PREFIX)) {
          response.statusCode = 404;
          response.end('not found');
          return;
        }

        const relative = pathname.slice(ASSET_PREFIX.length).replace(/^\/+/, '');
        if (!relative || relative.includes('\0')) {
          response.statusCode = 404;
          response.end('not found');
          return;
        }

        const file = resolve(ASSET_ROOT, relative);
        if (file !== ASSET_ROOT && !file.startsWith(ASSET_ROOT + sep)) {
          response.statusCode = 403;
          response.end('forbidden');
          return;
        }

        const type = CONTENT_TYPES[extname(file).toLowerCase()];
        if (!type) {
          response.statusCode = 404;
          response.end('not found');
          return;
        }

        try {
          const body = await readFile(file);
          response.setHeader('content-type', type);
          response.setHeader('cache-control', 'public, max-age=300');
          response.setHeader('content-length', String(body.length));
          response.statusCode = 200;
          response.end(request.method === 'HEAD' ? undefined : body);
        } catch (error) {
          if (error && error.code === 'ENOENT') {
            response.statusCode = 404;
            response.end('not found');
            return;
          }
          response.setHeader('cache-control', 'no-store');
          response.statusCode = 500;
          response.end('asset unavailable');
          console.error(`[clippy-companion] cannot read ${file}:`, error);
        }
      },
    }),
  );
}
