import { expect, test } from '@playwright/test';

test('o título do blog está no HTML antes do canvas', async ({ page }) => {
  const response = await page.goto('./blog/');
  expect(response?.status()).toBe(200);
  const html = await response!.text();
  expect(html).toContain('Notas');
  expect(html).not.toContain('data-paper="webgl"');
  await expect(page.locator('h1')).toBeVisible();
});

test('o contador do papel para cerca de dois segundos', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('./blog/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('body')).toHaveAttribute('data-paper', 'webgl');
  await page.waitForTimeout(2200);
  const first = await page.evaluate(
    () => document.documentElement.dataset.paperFrames,
  );
  await page.waitForTimeout(500);
  const second = await page.evaluate(
    () => document.documentElement.dataset.paperFrames,
  );
  expect(Number(first)).toBeGreaterThan(1);
  expect(second).toBe(first);
});

test('movimento reduzido deixa o papel em css sem canvas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./blog/');
  await expect(page.locator('body')).toHaveAttribute('data-paper', 'css');
  await expect(page.locator('#paper-field')).toHaveCount(0);
  await expect(page.locator('h1')).toContainText('Notas');
  const frames = await page.evaluate(
    () => document.documentElement.dataset.paperFrames,
  );
  await page.waitForTimeout(300);
  expect(
    await page.evaluate(() => document.documentElement.dataset.paperFrames),
  ).toBe(frames);
  expect(frames).toBe('0');
});

test('um redimensionamento desenha mais um quadro e para', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./blog/');
  await expect(page.locator('body')).toHaveAttribute('data-paper', 'webgl');
  await page.waitForTimeout(2200);
  const before = Number(
    await page.evaluate(() => document.documentElement.dataset.paperFrames),
  );
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(400);
  const after = Number(
    await page.evaluate(() => document.documentElement.dataset.paperFrames),
  );
  expect(after).toBeGreaterThan(before);
  await page.waitForTimeout(500);
  expect(
    Number(
      await page.evaluate(() => document.documentElement.dataset.paperFrames),
    ),
  ).toBe(after);
});

test('a home não monta o campo de papel', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('body')).not.toHaveAttribute(
    'data-surface',
    'blog',
  );
  await expect(page.locator('#paper-field')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveAttribute('data-paper', /.+/);
});

test('o papel plano contrasta com o texto nos dois temas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => localStorage.setItem('theme', 'light'));
  await page.goto('./blog/');
  await expect(page.locator('body')).toHaveAttribute('data-paper', 'webgl');
  await page.waitForTimeout(2200);
  const light = await sample(page);
  expect(light).toBeGreaterThanOrEqual(4.5);
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'dark';
  });
  await page.waitForTimeout(2500);
  const dark = await sample(page);
  expect(dark).toBeGreaterThanOrEqual(4.5);
});

async function sample(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const canvas = document.querySelector<HTMLCanvasElement>('#paper-field');
    const title = document.querySelector('h1');
    if (!canvas || !title) return 0;
    const gl = canvas.getContext('webgl');
    if (!gl) return 0;
    const rect = title.getBoundingClientRect();
    const scaleX = canvas.width / window.innerWidth;
    const scaleY = canvas.height / window.innerHeight;
    const x = Math.max(
      0,
      Math.floor((rect.left + rect.width / 2) * scaleX) - 12,
    );
    const y = Math.max(
      0,
      Math.floor((window.innerHeight - rect.bottom - 8) * scaleY),
    );
    const size = 24;
    const pixels = new Uint8Array(size * size * 4);
    gl.readPixels(
      Math.min(x, canvas.width - size),
      Math.min(y, canvas.height - size),
      size,
      size,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels,
    );
    // The title sits on .paper-sheet, which stays light. Page text uses body --text.
    const text = getComputedStyle(document.body).color.match(/[\d.]+/g);
    if (!text) return 0;
    const ink = text.slice(0, 3).map(Number);
    const lin = (channel: number) => {
      const s = channel / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    const lum = (rgb: number[]) =>
      0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
    const ratio = (rgb: number[]) => {
      const hi = Math.max(lum(ink), lum(rgb));
      const lo = Math.min(lum(ink), lum(rgb));
      return (hi + 0.05) / (lo + 0.05);
    };
    let darkest = [255, 255, 255];
    let lightest = [0, 0, 0];
    let minLum = 2;
    let maxLum = -1;
    for (let i = 0; i < pixels.length; i += 4) {
      const rgb = [pixels[i], pixels[i + 1], pixels[i + 2]];
      const value = lum(rgb);
      if (value < minLum) {
        minLum = value;
        darkest = rgb;
      }
      if (value > maxLum) {
        maxLum = value;
        lightest = rgb;
      }
    }
    return Math.min(ratio(darkest), ratio(lightest));
  });
}
