import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

it('o .nvmrc pede o Node 24', () => {
  expect(readFileSync('.nvmrc', 'utf8').trim()).toBe('24');
});
