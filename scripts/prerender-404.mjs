// SPA fallback for static hosts that serve 404.html for unknown paths (GitHub Pages and others).
import { copyFile } from 'node:fs/promises';
await copyFile('dist/index.html', 'dist/404.html');
