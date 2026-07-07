
import {expect, test} from 'vitest';
import app from './app.js';

test('adds two numbers', () => {
  expect(app.add(2, 3)).toBe(5);
});