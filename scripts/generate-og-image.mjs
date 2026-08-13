// Regenerates public/og-image.png from src/utils/resumeData.js so the social
// share preview never drifts out of sync with the site's real headline
// stats. Runs automatically before every build via the "prebuild" npm hook.
import sharp from "sharp";
import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import resumeData from "../src/utils/resumeData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const OUT_PATH = path.join(PUBLIC_DIR, "og-image.png");
const WIDTH = 1536;
const HEIGHT = 1024;
const ACCENT = "#8FB8FF";

// resumeData.photo is a base-path-prefixed URL (e.g. "/portfolio/Raza-ali.jpg")
// for the browser; strip that prefix to get the actual file on disk.
const photoFilename = resumeData.photo.split("/").pop();
const photoPath = path.join(PUBLIC_DIR, photoFilename);
const photoBuffer = await readFile(photoPath);
const photoMime = photoFilename.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
const photoDataUri = `data:${photoMime};base64,${photoBuffer.toString("base64")}`;
const PHOTO_CX = 1090;
const PHOTO_CY = 370;
const PHOTO_R = 150;

const escapeXml = (s) =>
  String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] ?? c));

const subtitle = resumeData.titles?.[0] ?? resumeData.title;
const locationLine = `${resumeData.location} · ${resumeData.timezone.split("·")[0].trim()}`;
// Capped + tight spacing so this can't silently overflow the canvas if
// credibilityStrip grows longer in the future.
const statsLine = resumeData.credibilityStrip.slice(0, 3).join("  ·  ");

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="photoClip">
      <circle cx="${PHOTO_CX}" cy="${PHOTO_CY}" r="${PHOTO_R}"/>
    </clipPath>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="#0d0d0d"/>

  <g stroke="${ACCENT}" fill="none" opacity="0.55">
    <line x1="984" y1="0" x2="984" y2="1024" stroke-width="1.5"/>
    <line x1="984" y1="240" x2="1536" y2="240" stroke-width="1.5"/>
    <line x1="984" y1="500" x2="1536" y2="500" stroke-width="1.5"/>
    <line x1="984" y1="795" x2="1536" y2="795" stroke-width="1.5"/>
    <line x1="1300" y1="0" x2="1300" y2="240" stroke-width="1.5"/>
    <line x1="1140" y1="240" x2="1140" y2="795" stroke-width="1.5"/>

    <circle cx="1090" cy="60" r="130" stroke-width="1.5"/>
    <circle cx="1470" cy="175" r="75" stroke-width="1.5"/>
    <circle cx="1400" cy="640" r="230" stroke-width="1.5"/>

    <path d="M984 20 L1230 240" stroke-width="1.5"/>
    <path d="M1300 20 L1536 250" stroke-width="1.5"/>
    <path d="M984 795 L1140 640" stroke-width="1.5"/>

    <g opacity="0.9">
      <circle cx="1210" cy="60" r="3"/><circle cx="1235" cy="60" r="3"/><circle cx="1260" cy="60" r="3"/><circle cx="1285" cy="60" r="3"/>
      <circle cx="1210" cy="85" r="3"/><circle cx="1235" cy="85" r="3"/><circle cx="1260" cy="85" r="3"/><circle cx="1285" cy="85" r="3"/>
      <circle cx="1210" cy="110" r="3"/><circle cx="1235" cy="110" r="3"/><circle cx="1260" cy="110" r="3"/><circle cx="1285" cy="110" r="3"/>
      <circle cx="1210" cy="135" r="3"/><circle cx="1235" cy="135" r="3"/><circle cx="1260" cy="135" r="3"/><circle cx="1285" cy="135" r="3"/>
      <circle cx="1210" cy="160" r="3"/><circle cx="1235" cy="160" r="3"/><circle cx="1260" cy="160" r="3"/><circle cx="1285" cy="160" r="3"/>
      <circle cx="1210" cy="185" r="3"/><circle cx="1235" cy="185" r="3"/><circle cx="1260" cy="185" r="3"/><circle cx="1285" cy="185" r="3"/>
      <circle cx="1210" cy="210" r="3"/><circle cx="1235" cy="210" r="3"/><circle cx="1260" cy="210" r="3"/><circle cx="1285" cy="210" r="3"/>
    </g>

    <g stroke-width="1.5">
      <line x1="984" y1="330" x2="1090" y2="330"/>
      <line x1="984" y1="350" x2="1090" y2="350"/>
      <line x1="984" y1="370" x2="1090" y2="370"/>
      <line x1="984" y1="390" x2="1090" y2="390"/>
      <line x1="984" y1="410" x2="1090" y2="410"/>
    </g>

    <path d="M1120 795 A120 120 0 0 1 1360 795" stroke-width="2"/>
    <path d="M1155 795 A85 85 0 0 1 1325 795" stroke-width="2"/>
    <path d="M1190 795 A50 50 0 0 1 1290 795" stroke-width="2"/>
  </g>

  <image href="${photoDataUri}" x="${PHOTO_CX - PHOTO_R}" y="${PHOTO_CY - PHOTO_R}" width="${PHOTO_R * 2}" height="${PHOTO_R * 2}" clip-path="url(#photoClip)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="${PHOTO_CX}" cy="${PHOTO_CY}" r="${PHOTO_R}" fill="none" stroke="${ACCENT}" stroke-width="3"/>

  <text x="80" y="400" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="92" fill="#ffffff">${escapeXml(resumeData.name)}</text>
  <text x="80" y="475" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="42" fill="${ACCENT}">${escapeXml(subtitle)}</text>
  <text x="80" y="565" font-family="Consolas, monospace" font-size="26" fill="#B7B7B7">${escapeXml(locationLine)}</text>

  <line x1="80" y1="880" x2="1456" y2="880" stroke="${ACCENT}" stroke-opacity="0.6" stroke-width="1.5"/>

  <rect x="80" y="925" width="66" height="66" rx="10" fill="none" stroke="${ACCENT}" stroke-width="2"/>
  <text x="113" y="968" font-family="Consolas, monospace" font-weight="700" font-size="28" fill="${ACCENT}" text-anchor="middle">&lt;/&gt;</text>

  <text x="172" y="968" font-family="Consolas, monospace" font-size="23" fill="#D8D8D8">${escapeXml(statsLine)}</text>
</svg>
`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
await writeFile(OUT_PATH, png);
console.log(`og-image.png regenerated from resumeData.js (${resumeData.credibilityStrip.length} stats)`);
