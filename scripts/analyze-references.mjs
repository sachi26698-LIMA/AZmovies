import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const out = '.artifacts/phase2';
mkdirSync(out, { recursive: true });

async function sample(file, x, y, size = 7) {
  const { data, info } = await sharp(`docs/references/${file}`)
    .extract({ left: x, top: y, width: size, height: size })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const totals = [0, 0, 0];
  for (let i = 0; i < data.length; i += info.channels) {
    totals[0] += data[i];
    totals[1] += data[i + 1];
    totals[2] += data[i + 2];
  }
  const n = size * size;
  const rgb = totals.map((v) => Math.round(v / n));
  return { x, y, rgb, hex: `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}` };
}

const primaryTop = 'Screenshot_20261107_220156.jpg';
const primaryGrid = 'Screenshot_20261107_220213.jpg';
const drawer = 'Screenshot_20261107_220137.jpg';
const pagination = 'Screenshot_20261107_220132.jpg';
const detailTop = 'detail-Screenshot_20261107_232018.jpg';
const detailLinks = 'detail-Screenshot_20261107_232041.jpg';

const report = {
  capturedAt: new Date().toISOString(),
  note: 'Samples are averaged JPEG regions from owner-supplied references (7x7 for flat areas, 1x1 for thin text/rules). They are observations, not exact source CSS. Browser chrome is excluded from prototype comparison crops.',
  files: {},
  samples: {
    primaryTop: {
      pageBackground: await sample(primaryTop, 15, 1500),
      headerBackground: await sample(primaryTop, 900, 300),
      searchBackground: await sample(primaryTop, 900, 520),
      greenButton: await sample(primaryTop, 150, 650),
      redButton: await sample(primaryTop, 500, 650),
      blueButton: await sample(primaryTop, 300, 780),
      orangeButton: await sample(primaryTop, 750, 780),
      categoryRed: await sample(primaryTop, 404, 918),
      posterBorderYellow: await sample(primaryTop, 474, 1838),
      posterBorderRed: await sample(primaryTop, 64, 1838),
      gridGap: await sample(primaryTop, 540, 2100),
      telegramBlue: await sample(primaryTop, 930, 2172),
    },
    primaryGrid: {
      headerBackground: await sample(primaryGrid, 900, 180),
      pageBackground: await sample(primaryGrid, 540, 1000),
      posterBorderYellow: await sample(primaryGrid, 492, 274),
    },
    drawer: {
      drawerBackground: await sample(drawer, 700, 1200),
      searchBackground: await sample(drawer, 170, 398),
      rowBorder: await sample(drawer, 700, 648),
    },
    pagination: {
      activeBackground: await sample(pagination, 120, 1520),
      inactiveBackground: await sample(pagination, 250, 1520),
      footerBackground: await sample(pagination, 100, 1900),
    },
    detail: {
      pageBackground: await sample(detailTop, 20, 1100),
      titlePanel: await sample(detailTop, 100, 1700),
      dateChip: await sample(detailTop, 100, 2030),
      genreChip: await sample(detailTop, 500, 2030),
      linkBlue: await sample(detailLinks, 329, 689, 1),
      redHeading: await sample(detailLinks, 302, 536, 1),
      rule: await sample(detailLinks, 251, 350, 1),
      mutedText: await sample(detailLinks, 494, 356, 1),
    },
  },
  geometryEstimatesCssPxAt360: {
    referenceDprAssumption: 3,
    primaryHeaderHeight: 51,
    primaryHeaderHorizontalMargin: 9,
    primarySearchHeight: 36,
    primarySearchHorizontalMargin: 29,
    categoryButtonHeight: 38,
    posterColumnWidth: 147,
    posterGridHorizontalMargin: 20,
    posterGridGap: 26,
    posterBorderWidth: 3,
    drawerWidthPercent: 70,
    paginationHeight: 39,
  },
};

for (const file of [primaryTop, primaryGrid, drawer, pagination, detailTop, detailLinks]) {
  const meta = await sharp(`docs/references/${file}`).metadata();
  report.files[file] = { width: meta.width, height: meta.height };
}

await sharp(`docs/references/${primaryTop}`)
  .extract({ left: 0, top: 234, width: 1080, height: 2166 })
  .png()
  .toFile(`${out}/reference-primary-top.png`);
await sharp(`docs/references/${primaryGrid}`)
  .extract({ left: 0, top: 117, width: 1080, height: 2283 })
  .png()
  .toFile(`${out}/reference-primary-grid.png`);

await sharp(`docs/references/${detailTop}`)
  .extract({ left: 0, top: 160, width: 1080, height: 2166 })
  .png()
  .toFile(`${out}/reference-detail-top.png`);

writeFileSync(`${out}/reference-analysis.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.samples, null, 2));
console.log(`Wrote ${out}/reference-analysis.json and comparison crops.`);
