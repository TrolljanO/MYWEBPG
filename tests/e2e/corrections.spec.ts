import { expect, test } from '@playwright/test';

const routes = [
  './',
  './blog/',
  './about/',
  './projects/',
  './resume/',
  './privacy/',
  './nao-existe/',
  './projects/sdd-buddy/',
  './projects/micro-rag/',
];

test('os projetos publicados não mostram Autor', async ({ page }) => {
  await page.goto('./projects/sdd-buddy/');
  await expect(page.locator('body')).not.toContainText('Autor');
  await page.goto('./projects/micro-rag/');
  await expect(page.locator('body')).not.toContainText('Autor');
});

test('alvos de 44px nas rotas abertas a 390', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const small: string[] = [];
  for (const path of routes) {
    await page.goto(path);
    const boxes = await page.locator('a, button').evaluateAll((elements) =>
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const visible =
          style.visibility !== 'hidden' &&
          style.display !== 'none' &&
          box.width > 0 &&
          box.height > 0;
        return {
          text: (
            element.textContent ||
            element.getAttribute('aria-label') ||
            ''
          )
            .trim()
            .slice(0, 40),
          width: box.width,
          height: box.height,
          visible,
        };
      }),
    );
    for (const box of boxes) {
      if (!box.visible) continue;
      if (box.width < 44 || box.height < 44) {
        small.push(
          `${path} “${box.text}” ${box.width.toFixed(1)}×${box.height.toFixed(1)}`,
        );
      }
    }
  }
  expect(small).toEqual([]);
});

test('o acento de está não encosta no q a 200%', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./');
  await page.evaluate(() => {
    document.documentElement.style.zoom = '2';
  });
  await page.evaluate(() => document.fonts.ready);
  const gap = await page.locator('.footer-name').evaluate((name) => {
    const texts = [...name.childNodes].filter(
      (node): node is Text => node.nodeType === Node.TEXT_NODE,
    );
    const style = getComputedStyle(name);
    const context = document.createElement('canvas').getContext('2d');
    if (!context || texts.length < 2) return null;
    context.font = style.font;
    const qInk = context.measureText('q');
    const aInk = context.measureText('á');
    const glyph = (node: Text, index: number) => {
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + 1);
      const item = range.getBoundingClientRect();
      return { left: item.left, right: item.right, top: item.top };
    };
    const q = glyph(texts[0], texts[0].data.indexOf('q'));
    const accent = glyph(texts[1], texts[1].data.indexOf('á'));
    const scale = (accent.top - q.top) / Number.parseFloat(style.lineHeight);
    return {
      overlapsX: q.right > accent.left && accent.right > q.left,
      inkGap:
        accent.top -
        q.top -
        (qInk.actualBoundingBoxDescent + aInk.actualBoundingBoxAscent) * scale,
      q,
      accent,
    };
  });
  expect(gap?.overlapsX, JSON.stringify(gap)).toBe(true);
  expect(gap?.inkGap).toBeGreaterThan(0);
});

test('o arquivo vazio não repete o título', async ({ page }) => {
  await page.goto('./blog/');
  await expect(page.getByRole('heading', { level: 2 })).toHaveCount(0);
  await expect(page.getByText('O arquivo está pronto.')).toBeVisible();
});

test('o caderno ocupa a coluna e guarda a segunda folha', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./');
  const widths = await page.evaluate(() => {
    const notebook = document.querySelector('.notebook');
    const wrap = notebook?.parentElement;
    if (!notebook || !wrap) return null;
    const before = getComputedStyle(notebook, '::before');
    return {
      notebook: notebook.getBoundingClientRect().width,
      wrap: wrap.getBoundingClientRect().width,
      layer: before.content,
    };
  });
  expect(widths).not.toBeNull();
  expect(widths!.notebook).toBeGreaterThan(widths!.wrap - 2);
  expect(widths!.layer).not.toBe('none');
});
