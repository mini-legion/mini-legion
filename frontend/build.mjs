import { copyFile, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

await Promise.all([
  copyFile('index.html', 'dist/index.html'),
  copyFile('_redirects', 'dist/_redirects'),
  copyFile('robots.txt', 'dist/robots.txt'),
]);

console.log('Legacy redirect build created in frontend/dist');
