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
test('reduced motion evita WebGL, acessibilidade nos dois temas', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.locator('canvas')).toHaveCount(0);
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
test('RSS e robots incluem o base path correto', async ({ request }) => {
  const rss = await request.get('rss.xml');
  expect(rss.ok()).toBe(true);
  expect(await rss.text()).toContain('<rss');
  const robots = await request.get('robots.txt');
  expect(await robots.text()).toContain('sitemap-index.xml');
});
