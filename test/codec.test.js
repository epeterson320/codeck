import { textToDeck, deckToText } from './codec';

test('Encodes and decodes symmetrically', () => {
  expect(deckToText(textToDeck('Hello')).toBe('Hello'));
});
