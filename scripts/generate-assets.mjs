/**
 * Gera og-image.png (1200x630) a partir do hero renderizado e os ícones PNG a partir do favicon.svg.
 * Uso (com o dev server rodando): node scripts/generate-assets.mjs [baseUrl]
 * Rode novamente quando o logotipo/símbolo oficial substituir o favicon provisório.
 */
import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'

const base = process.argv[2] || 'http://localhost:5199'
const browser = await chromium.launch({ channel: 'chrome', args: ['--use-angle=d3d11', '--enable-gpu'] })

// Open Graph — o próprio hero, com a escultura 3D
{
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.waitForTimeout(4000)
  await page.addStyleTag({ content: 'header, .grain { display: none !important }' })
  await page.screenshot({ path: 'public/og-image.png' })
  await page.close()
}

// Ícones
const svg = readFileSync('public/favicon.svg', 'utf8')
for (const [name, size] of [
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } })
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`,
  )
  await page.screenshot({ path: `public/${name}`, omitBackground: true })
  await page.close()
}

await browser.close()
console.log('Assets gerados em public/')
