import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('navegação, tema persistente e teclado', async ({ page }) => {
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Pular para o conteúdo' }),
  ).toBeFocused();
  await page.getByRole('button', { name: /Ativar tema/ }).click();
  const theme = await page.locator('html').getAttribute('data-theme');
  await page.getByRole('link', { name: 'Ler o blog' }).click();
  await expect(page.locator('h1')).toContainText('Notas');
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme!);
});
test('sem JS: navegação mobile e estados vazios', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 700 },
  });
  const page = await context.newPage();
  await page.goto(test.info().project.use.baseURL!);
  await page.locator('.mobile-nav summary').click();
  await page
    .locator('.mobile-nav')
    .getByRole('link', { name: 'Blog', exact: true })
    .click();
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.getByText('Nenhum artigo publicado ainda.')).toBeVisible();
  await context.close();
});
test('reduced motion pausa os dioramas, acessibilidade nos dois temas', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.locator('[data-diorama][data-paused]')).toHaveCount(2);
  await expect(page.locator('.motion-toggle[hidden]')).toHaveCount(2);
  await expect(
    page.getByRole('button', { name: 'Pausar movimento' }),
  ).toHaveCount(0);
  for (const theme of ['dark', 'light']) {
    await page.evaluate(
      (t) => (document.documentElement.dataset.theme = t),
      theme,
    );
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  }
});
test('layout sem overflow entre 320 e 2560px', async ({ page }) => {
  for (const width of [320, 390, 768, 1440, 2560]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
test('Pausar movimento na home', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('./');
  const pause = page.getByRole('button', { name: 'Pausar movimento' });
  await expect(pause).toHaveCount(2);
  await expect(pause.first()).toBeVisible();
  await pause.first().click();
  await expect(page.locator('[data-diorama][data-paused]')).toHaveCount(2);
  await expect
    .poll(() => page.evaluate(() => document.getAnimations().length))
    .toBe(0);
});
const axeTags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];
const visitorRoutes = [
  ['home', './'],
  ['blog', './blog/'],
  ['sobre', './about/'],
  ['projetos', './projects/'],
  ['currículo', './resume/'],
  ['privacidade', './privacy/'],
  ['404', './nao-existe/'],
  ['sdd-buddy', './projects/sdd-buddy/'],
  ['micro-rag', './projects/micro-rag/'],
];
for (const theme of ['light', 'dark'] as const) {
  test(`axe nas rotas abertas no tema ${theme}`, async ({ page }) => {
    await page.addInitScript((value) => {
      localStorage.setItem('theme', value);
    }, theme);
    for (const [name, path] of visitorRoutes) {
      const response = await page.goto(path);
      expect(response?.status(), name).toBe(name === '404' ? 404 : 200);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const result = await new AxeBuilder({ page }).withTags(axeTags).analyze();
      expect(result.violations, name).toEqual([]);
    }
  });
}
test('o blog com movimento reduzido não anima', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./blog/');
  await expect(page.locator('body')).toHaveAttribute('data-paper', 'css');
  await expect(page.locator('#paper-field')).toHaveCount(0);
  await expect(page.locator('[data-diorama][data-paused]')).toHaveCount(1);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter((animation) => animation.playState === 'running').length,
      ),
    )
    .toBe(0);
});
test('o palco ocupa a largura da página em 390', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [path, count] of [
    ['./', 2],
    ['./blog/', 1],
  ] as const) {
    await page.goto(path);
    const widths = await page.locator('.diorama-stage').evaluateAll((nodes) =>
      nodes.map((node) => ({
        width: node.getBoundingClientRect().width,
        viewport: document.documentElement.clientWidth,
      })),
    );
    expect(widths, path).toHaveLength(count);
    for (const box of widths) {
      expect(box.width, path).toBeGreaterThanOrEqual(box.viewport - 1);
    }
  }
});
test('RSS e robots incluem o base path correto', async ({ request }) => {
  const rss = await request.get('rss.xml');
  expect(rss.ok()).toBe(true);
  expect(await rss.text()).toContain('<rss');
  const robots = await request.get('robots.txt');
  expect(await robots.text()).toContain('sitemap-index.xml');
});
