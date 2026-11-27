// Builds the favicon set from one SVG monogram: an emerald "RM" tile that
// matches the logo badge in the site header. The letters are drawn as strokes
// (not text), so they render identically everywhere, even at 16px.
//
//   node scripts/generate-icons.mjs
//
// Writes public/favicon.svg, favicon-32.png, apple-touch-icon.png,
// logo192.png and logo512.png.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PUBLIC_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");

const LETTERS = `
    <path d="M13 45V19.5h7.5a7.25 7.25 0 0 1 0 14.5H13M21 34l6.5 11" />
    <path d="M36 45V19.5l7.5 12.5 7.5-12.5V45" />`;

// rounded: browser tab icon with its own rounded corners.
// full-bleed: home-screen icons, where iOS/Android apply their own mask.
const svg = ({ rounded }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6ee7b7"/>
      <stop offset="0.55" stop-color="#34d399"/>
      <stop offset="1" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="${rounded ? 15 : 0}" fill="url(#g)"/>
  <rect width="64" height="64" rx="${rounded ? 15 : 0}" fill="url(#shine)"/>
  <g fill="none" stroke="#032116" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round">${LETTERS}
  </g>
</svg>
`;

const tab = svg({ rounded: true });
const bleed = svg({ rounded: false });

await writeFile(path.join(PUBLIC_DIR, "favicon.svg"), tab);
const png = (src, size, file) => sharp(Buffer.from(src), { density: 72 * (size / 64) * 2 }).resize(size, size).png().toFile(path.join(PUBLIC_DIR, file));
await png(tab, 32, "favicon-32.png");
await png(bleed, 180, "apple-touch-icon.png");
await png(bleed, 192, "logo192.png");
await png(bleed, 512, "logo512.png");
console.log("icons: favicon.svg, favicon-32.png, apple-touch-icon.png, logo192.png, logo512.png");
