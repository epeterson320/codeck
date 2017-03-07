import { textToDeck, deckToText } from './codec';

/* eslint-env jest */

test('Encodes and decodes symmetrically', () => {
  expect(deckToText(textToDeck('Hello')).toBe('Hello'));
});
