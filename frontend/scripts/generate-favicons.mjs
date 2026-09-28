import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgPath = path.resolve('public/favicon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  console.log('Generating PNG and ICO favicons from favicon.svg...');

  // 16x16 PNG
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile('public/favicon-16x16.png');

  // 32x32 PNG
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile('public/favicon-32x32.png');

  // 32x32 ICO (saved as favicon.ico in public and app)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile('public/favicon.ico');

  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile('src/app/favicon.ico');

  // 180x180 Apple Touch Icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');

  // 192x192 Web App Icon
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('public/icon-192.png');

  console.log('All favicons successfully generated!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
