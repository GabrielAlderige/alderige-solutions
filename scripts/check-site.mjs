/**
 * Verificação automatizada do site (Playwright + Chrome instalado).
 * Uso: node scripts/check-site.mjs [baseUrl] [pastaDeSaida]
 * - Captura screenshots desktop/mobile em pontos da home e páginas internas
 * - Coleta erros de console e requisições quebradas
 * - Testa menu mobile, links internos e validação do formulário
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const base = process.argv[2] || 'http://localhost:5173'
const out = process.argv[3] || 'check-output'
mkdirSync(out, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome', args: ['--use-angle=d3d11', '--enable-gpu'] })
const problems = []

async function newPage(viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, ...opts })
  const page = await ctx.newPage()
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') problems.push(`[console ${m.type()}] ${m.text()}`)
  })
  page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message}`))
  page.on('response', (r) => {
    if (r.status() >= 400) problems.push(`[http ${r.status()}] ${r.url()}`)
  })
  return { ctx, page }
}

const shots = async (page, prefix, ids) => {
  for (const id of ids) {
    if (id === 'top') await page.evaluate(() => window.scrollTo(0, 0))
    else await page.evaluate((i) => document.getElementById(i)?.scrollIntoView({ behavior: 'instant' }), id)
    await page.waitForTimeout(1600)
    await page.screenshot({ path: join(out, `${prefix}-${id}.png`) })
  }
}

// ---------- Desktop
{
  const { ctx, page } = await newPage({ width: 1440, height: 900 })
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)
  await shots(page, 'desk', ['top', 'sobre', 'solucoes', 'projetos', 'insights', 'cta-final', 'contato'])

  // Seções intermediárias (processo, diferenciais) sem id — screenshots por posição
  for (const sel of ['#processo-title', '#diferenciais-title']) {
    await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ behavior: 'instant', block: 'start' }), sel)
    await page.waitForTimeout(1600)
    await page.screenshot({ path: join(out, `desk-${sel.slice(1)}.png`) })
  }

  // Formulário: envio vazio deve mostrar erros
  await page.evaluate(() => document.getElementById('contato')?.scrollIntoView({ behavior: 'instant' }))
  await page.click('button[type=submit]')
  await page.waitForTimeout(400)
  const errCount = await page.locator('#contato [aria-invalid=true]').count()
  if (errCount < 3) problems.push(`[form] esperado >=3 campos inválidos, obtido ${errCount}`)
  await page.screenshot({ path: join(out, 'desk-form-errors.png') })

  // Preenchido: sem endpoint, deve avisar que não está configurado
  await page.fill('input[name=nome]', 'Teste')
  await page.fill('input[name=email]', 'teste@exemplo.com')
  await page.check('input[value="Automação"]', { force: true })
  await page.fill('textarea[name=mensagem]', 'Quero automatizar o envio de propostas comerciais.')
  await page.check('input[name=consent]')
  await page.click('button[type=submit]')
  await page.waitForTimeout(500)
  await page.screenshot({ path: join(out, 'desk-form-submitted.png') })
  const notice = await page.locator('#contato [role=alert], #contato [role=status]').allTextContents()
  console.log('Form feedback:', notice.join(' | ').slice(0, 200))

  // Links internos
  const hrefs = await page.$$eval('a[href^="/"], a[href^="#"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))])
  console.log('Links internos:', hrefs.length)
  for (const h of hrefs) {
    if (h.startsWith('#') && h.length > 1) {
      const ok = await page.evaluate((id) => !!document.getElementById(id), h.slice(1))
      if (!ok) problems.push(`[link] âncora inexistente ${h}`)
    }
  }
  const webgl = await page.evaluate(() => getComputedStyle(document.querySelector('canvas')).opacity)
  console.log('Opacidade do canvas no fim da página:', webgl)
  await ctx.close()

  // Páginas internas
  const { ctx: c2, page: p2 } = await newPage({ width: 1440, height: 900 })
  for (const path of ['/projetos/site-institucional-alderige', '/projetos/triagem-de-atendimento-com-ia', '/insights/quando-automatizar-um-processo', '/privacidade', '/rota-inexistente']) {
    await p2.goto(base + path, { waitUntil: 'networkidle' })
    await p2.waitForTimeout(1500)
    await p2.screenshot({ path: join(out, `page${path.replace(/\//g, '_')}.png`), fullPage: false })
  }
  await c2.close()
}

// ---------- Mobile
{
  const { ctx, page } = await newPage({ width: 390, height: 844 }, { isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  if (overflow > 0) problems.push(`[mobile] scroll horizontal de ${overflow}px`)
  await shots(page, 'mob', ['top', 'sobre', 'solucoes', 'projetos', 'cta-final', 'contato'])
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)
  await page.click('button[aria-controls=menu-mobile]')
  await page.waitForTimeout(1200)
  await page.screenshot({ path: join(out, 'mob-menu.png') })
  await page.click('#menu-mobile a[href="#solucoes"]')
  await page.waitForTimeout(1500)
  const menuOpen = await page.getAttribute('button[aria-controls=menu-mobile]', 'aria-expanded')
  if (menuOpen !== 'false') problems.push('[mobile] menu não fechou após navegar')
  await ctx.close()
}

// ---------- Reduced motion
{
  const { ctx, page } = await newPage({ width: 1440, height: 900 }, { reducedMotion: 'reduce' })
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  await page.screenshot({ path: join(out, 'reduced-top.png') })
  await ctx.close()
}

await browser.close()
console.log(problems.length ? `\nPROBLEMAS (${problems.length}):\n${problems.join('\n')}` : '\nNenhum problema encontrado.')
