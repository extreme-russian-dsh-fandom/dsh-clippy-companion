/**
 * Host half of the Clippy Companion plugin.
 *
 * The browser needs the sprite sheet and its frame manifest, but a dynamic
 * Client plugin cannot read package files. Two read-only routes serve exactly
 * those two files from this package directory; nothing else is exposed.
 */
import { readFile } from 'node:fs/promises';

const ROUTES = {
  '/clippy-companion/clippy-map.png': {
    file: new URL('./assets/clippy-map.png', import.meta.url),
    type: 'image/png',
  },
  '/clippy-companion/sprite-data.json': {
    file: new URL('./assets/sprite-data.json', import.meta.url),
    type: 'application/json; charset=utf-8',
  },
};

export const inject = ['webServer'];

export function apply(ctx) {
  for (const [path, asset] of Object.entries(ROUTES)) {
    let cached;

    ctx.effect(() =>
      ctx.webServer.register({
        kind: 'exact',
        path,
        handler: async (request, response) => {
          if (request.method !== 'GET' && request.method !== 'HEAD') {
            response.setHeader('allow', 'GET, HEAD');
            response.statusCode = 405;
            response.end();
            return;
          }

          try {
            cached ??= await readFile(asset.file);
          } catch (error) {
            response.setHeader('cache-control', 'no-store');
            response.statusCode = 500;
            response.end('asset unavailable');
            console.error(`[clippy-companion] cannot read ${asset.file}:`, error);
            return;
          }

          response.setHeader('content-type', asset.type);
          response.setHeader('cache-control', 'public, max-age=3600');
          response.setHeader('content-length', String(cached.length));
          response.statusCode = 200;
          response.end(request.method === 'HEAD' ? undefined : cached);
        },
      }),
    );
  }
}
