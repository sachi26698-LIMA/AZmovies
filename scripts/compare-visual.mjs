import sharp from 'sharp';
import { existsSync, writeFileSync } from 'node:fs';

const out = '.artifacts/phase2';
const reference = `${out}/reference-primary-top.png`;
const prototype = `${out}/prototype-360-top.png`;
if (!existsSync(reference) || !existsSync(prototype)) {
  console.error(
    'Missing reference/prototype crops. Run analyze:references and capture:prototype first.',
  );
  process.exit(1);
}

const refMeta = await sharp(reference).metadata();
const proMeta = await sharp(prototype).metadata();
const width = refMeta.width ?? 1080;
const height = Math.min(refMeta.height ?? 2166, proMeta.height ?? 2166);
const labelHeight = 64;
const ref = await sharp(reference).extract({ left: 0, top: 0, width, height }).toBuffer();
const pro = await sharp(prototype).extract({ left: 0, top: 0, width, height }).toBuffer();
const label = (text) =>
  Buffer.from(
    `<svg width="${width}" height="${labelHeight}"><rect width="100%" height="100%" fill="#1b242b"/><text x="24" y="42" font-family="sans-serif" font-size="28" fill="#fff">${text}</text></svg>`,
  );

await sharp({
  create: { width: width * 2, height: height + labelHeight, channels: 3, background: '#000' },
})
  .composite([
    { input: label('MOVIES4U reference (owner supplied)'), left: 0, top: 0 },
    { input: label('AZmovies static prototype'), left: width, top: 0 },
    { input: ref, left: 0, top: labelHeight },
    { input: pro, left: width, top: labelHeight },
  ])
  .png()
  .toFile(`${out}/comparison-primary-top.png`);

const outputs = [`${out}/comparison-primary-top.png`];
const detailReference = `${out}/reference-detail-top.png`;
const detailPrototype = `${out}/prototype-360-detail-top.png`;
if (existsSync(detailReference) && existsSync(detailPrototype)) {
  const dRefMeta = await sharp(detailReference).metadata();
  const dProMeta = await sharp(detailPrototype).metadata();
  const dWidth = dRefMeta.width ?? 1080;
  const dHeight = Math.min(dRefMeta.height ?? 2166, dProMeta.height ?? 2166);
  const dRef = await sharp(detailReference)
    .extract({ left: 0, top: 0, width: dWidth, height: dHeight })
    .toBuffer();
  const dPro = await sharp(detailPrototype)
    .extract({ left: 0, top: 0, width: dWidth, height: dHeight })
    .toBuffer();
  await sharp({
    create: { width: dWidth * 2, height: dHeight + labelHeight, channels: 3, background: '#000' },
  })
    .composite([
      { input: label('HDHub4u detail reference (owner supplied)'), left: 0, top: 0 },
      { input: label('AZmovies detail prototype'), left: dWidth, top: 0 },
      { input: dRef, left: 0, top: labelHeight },
      { input: dPro, left: dWidth, top: labelHeight },
    ])
    .png()
    .toFile(`${out}/comparison-detail-top.png`);
  outputs.push(`${out}/comparison-detail-top.png`);
}

const report = {
  comparedAt: new Date().toISOString(),
  reference: 'docs/references/Screenshot_20261107_220156.jpg',
  detailReference: 'docs/references/detail-Screenshot_20261107_232018.jpg',
  prototypeCapture: '360x722 CSS px at DPR 3',
  method:
    'Side-by-side aligned crop excluding Android browser chrome. Posters/titles are synthetic fixtures, so raw pixel equality is not a fidelity score.',
  outputs,
  status: 'executed visual comparison artifact; owner visual approval still required',
};
writeFileSync(`${out}/visual-comparison.json`, JSON.stringify(report, null, 2));
console.log(`Wrote ${outputs.join(', ')}`);
