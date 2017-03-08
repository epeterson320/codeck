import Codeck from '../src/Codeck';

describe('Codeck', () => {
  test('Can be instantiated with or without `new`', () => {
    expect(new Codeck()).toBeInstanceOf(Codeck);
    expect(Codeck()).toBeInstanceOf(Codeck);
  });

  test.skip('Encodes and decodes symmetrically', () => {
    const codec = new Codeck();
    const message = 'Hello';
    const encoded = codec.textToDeck(message);
    const decoded = codec.deckToText(encoded);
    expect(decoded).toBe(message);
  });
});
