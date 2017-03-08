export function textToBase(text, charIndexes) {
  return text.split('').map(c => charIndexes[c]);
}

export function baseToNumber(digits, base) {
  return digits.reduce((el, acc) => {
    return (acc + el) * base;
  }, 0) / base;
}

export function numberToFactoradic(number) {
  let radix = 1;
  let remaining = number;
  const factoradic = [];
  while (remaining > 0) {
    factoradic.unshift(remaining % radix);
    remaining = Math.floor(remaining / radix);
    radix++;
  }
  return factoradic;
}

export function factoradicToPermutation(_factoradic, sorted) {
  const factoradic = _factoradic.slice();
  while (factoradic.length < sorted.length) factoradic.unshift(0);

  let remaining = sorted;
  return factoradic.map((digit) => {
    const el = remaining[digit];
    remaining = remaining.filter((el, i) => i != digit);
    return el;
  });
}

export function permutationToDeck(permutation, cardOrder) {
  return permutation.map(i => cardOrder[i]);
}

export default function encode(text, charIndexes, cardOrder) {
  const digits = textToBase(text, charIndexes);
  const n = baseToNumber(digits, Object.keys(charIndexes).length);
  const fact = numberToFactoradic(n);
  const perm = factoradicToPermutation(fact, cardOrder.map((el, i) => i));
  return permutationToDeck(perm, cardOrder);
}
