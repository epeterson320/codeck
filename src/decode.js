export function deckToPermutation(deck, indexesByCard) {
  return deck.map(card => indexesByCard[card]);
}

export function permutationToFactoradic(_permutation) {
  const permutation = _permutation.slice(); // Copy since it will be mutated.
  const factoradic = new Array(permutation.length);
  const lastIdx = permutation.length - 1;
  for (let i = 0; i <= lastIdx; i++) {
    const el = permutation[i];
    factoradic[i] = el;
    for (let j = i + 1; j <= lastIdx; j++) {
      if (permutation[j] > el) permutation[j]--;
    }
  }
  return factoradic;
}

export function factoradicToNumber(factoradic) {
  // This works because:
  // factoradic 341010
  // = 3x5! + 4x4! + 1x3! + 0x2! + 1x1! + 0x0!
  // = ((((3x5 + 4)x4 + 1)x3 + 0)x2 + 1)x1 + 0
  return factoradic
    .slice(0, -1) // Ignore the last element since it's always 0
    .reduce((acc, el, i) => (acc + el) * (factoradic.length - 1 - i), 0);
}

export function toBase(num, base) {
  let remaining = num;
  const result = [];
  while (remaining > 0) {
    const rem = remaining % base;
    result.unshift(rem);
    remaining -= rem;
    remaining /= base;
  }
  return result;
}

export function baseToText(digits, charset) {
  return digits.map(d => charset[d]).join('');
}
