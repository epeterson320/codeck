import {
  textToBase,
  baseToNumber,
  numberToFactoradic,
  factoradicToPermutation,
  permutationToDeck,
} from '../src/encode';
import { Charsets } from '../src/Codeck';

describe('textToBase()', () => {
  test('should work on a small charset', () => {
    const alphanumIndexes = {};
    Charsets.ALPHANUMERIC.forEach((el, i) => { alphanumIndexes[el] = i; });
    expect(textToBase('hello', alphanumIndexes)).toEqual([8, 5, 12, 12, 15]);
  });
});

describe('baseToNumber', () => {
  test('should work on small problems', () => {
    expect(baseToNumber([1, 1, 1, 1], 2)).toBe(15);
    expect(baseToNumber([1, 0, 0, 0], 2)).toBe(8);
  });
});

describe('numberToFactoradic', () => {
  test('should work on the wikipedia example', () => {
    expect(numberToFactoradic(463)).toEqual([3, 4, 1, 0, 1, 0]);
  });
});

describe('factoradicToPermutation', () => {
  test('should work with the wikipedia example', () => {
    const sorted = [0, 1, 2, 3, 4, 5, 6];
    const factoradic = [4, 0, 4, 1, 0, 0, 0];
    const permutation = factoradicToPermutation(factoradic, sorted);
    expect(permutation).toEqual([4, 0, 6, 2, 1, 3, 5]);
  });
});

describe('permutationToDeck', () => {
  test('should work on a small example', () => {
    const permutation = [0, 3, 1, 2];
    const cardOrder = ['AS', 'KS', 'QS', 'JS'];
    const deck = permutationToDeck(permutation, cardOrder);
    expect(deck).toEqual(['AS', 'JS', 'KS', 'QS']);
  });
});
