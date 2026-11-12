import { expect, test } from '@playwright/test';

test('a Manrope não muda de forma depois de carregar a 1440', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const response = await page.goto('./', { waitUntil: 'domcontentloaded' });
  expect(await response?.text()).toContain('rel="preload"');
  expect(await response?.text()).toMatch(/manrope[^"]+\.woff2/);
  const width = () =>
    page.evaluate(() => {
      const probe = document.createElement('span');
      probe.textContent = 'Hamburgo';
      probe.style.font = '400 32px Manrope, monospace';
      probe.style.position = 'absolute';
      document.body.appendChild(probe);
      const manrope = probe.getBoundingClientRect().width;
      probe.style.font = '400 32px monospace';
      const mono = probe.getBoundingClientRect().width;
      probe.remove();
      return {
        manrope,
        mono,
        loaded: document.fonts.check('400 32px Manrope'),
      };
    });
  const before = await width();
  await page.evaluate(() => document.fonts.ready);
  const after = await width();
  expect(before.loaded).toBe(true);
  expect(after.loaded).toBe(true);
  expect(after.manrope).toBe(before.manrope);
  expect(after.manrope).not.toBe(after.mono);
});
