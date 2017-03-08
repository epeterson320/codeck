import Codeck from '../src/Codeck';

const smallDeck = ['AS', 'KS', 'QS', 'JS'];
const smallCharset = [' ', 'X'];

describe('Codeck', () => {
  test('Can be instantiated with or without `new`', () => {
    expect(new Codeck()).toBeInstanceOf(Codeck);
    expect(Codeck()).toBeInstanceOf(Codeck);
  });

  test('Can be given a custom deck and charset', () => {
    const codeck = new Codeck(smallDeck, smallCharset);
    expect(codeck.deck).toBe(smallDeck);
    expect(codeck.charset).toBe(smallCharset);
  });

  test('computes a sensible max length', () => {
    const codec = new Codeck(smallDeck, smallCharset);
    expect(codec.maxLength).toBe(4);
  });

  test('encodes', () => {
    const codec = new Codeck(smallDeck, smallCharset);
    expect(codec.encode('   X')).toEqual(['AS', 'KS', 'JS', 'QS']);
  });

  test('decodes', () => {
    const codec = new Codeck(smallDeck, smallCharset);
    expect(codec.decode(['AS', 'KS', 'JS', 'QS'])).toBe('   X');
  });
});
