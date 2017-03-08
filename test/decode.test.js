import deckToText, {
  deckToPermutation,
  permutationToFactoradic,
  factoradicToNumber,
  toBase,
  baseToText,
} from '../src/decode';

describe('decode', () => {
  test('works on a small deck and charset', () => {
    // these parameters work because 4! >= 2^4
    const cardIndexes = { 'W': 0, 'X': 1, 'Y': 2, 'Z': 3 };
    const charset = [' ', 'X'];
    const message = deckToText(['W', 'X', 'Z', 'Y'], cardIndexes, charset, 4);
    expect(message).toBe('   X');
  });
});

describe('deckToPermutation', () => {
  test('works on a deck of three', () => {
    const deck = ['4S', '2S', '3S'];
    const order = { '2S': 0, '3S': 1, '4S': 2 };
    const permutation = deckToPermutation(deck, order);
    expect(permutation).toEqual([2, 0, 1]);
  });
});

describe('permutationToFactoradic', () => {
  test('works on a small permutation', () => {
    const permutation = [2, 0, 1];
    const factoradic = permutationToFactoradic(permutation);
    expect(factoradic).toEqual([2, 0, 0]);
  });

  test('works on the wikipedia example', () => {
    const permutation = [1, 5, 0, 6, 3, 4, 2];
    const factoradic = permutationToFactoradic(permutation);
    expect(factoradic).toEqual([1, 4, 0, 3, 1, 1, 0]);
  });
});

describe('factoradicToNumber', () => {
  test('works on a small factoradic', () => {
    expect(factoradicToNumber([2, 0, 0])).toBe(4);
  });

  test('works on the wikipedia example', () => {
    expect(factoradicToNumber([3, 4, 1, 0, 1, 0])).toBe(463);
  });
});

describe('toBase', () => {
  test('Works on small problems', () => {
    expect(toBase(8, 2)).toEqual([1, 0, 0, 0]);
    expect(toBase(0, 2)).toEqual([]);
    expect(toBase(15, 2)).toEqual([1, 1, 1, 1]);
  });
});

describe('baseToText', () => {
  test('Works on a small charset', () => {
    const charset = ['A', 'B', 'C', 'D', 'E'];
    expect(baseToText([1, 4, 4], charset)).toBe('BEE');
  });
});
