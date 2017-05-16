import Big from 'big.js'

export function deckToPermutation (deck, cardIndexes) {
  return deck.map(card => cardIndexes[card])
}

export function permutationToFactoradic (_permutation) {
  const permutation = _permutation.slice() // Copy since it will be mutated.
  const factoradic = new Array(permutation.length)
  const lastIdx = permutation.length - 1
  for (let i = 0; i <= lastIdx; i++) {
    const el = permutation[i]
    factoradic[i] = el
    for (let j = i + 1; j <= lastIdx; j++) {
      if (permutation[j] > el) permutation[j]--
    }
  }
  return factoradic
}

export function factoradicToNumber (factoradic) {
  // This works because:
  // factoradic 341010
  // = 3x5! + 4x4! + 1x3! + 0x2! + 1x1! + 0x0!
  // = ((((3x5 + 4)x4 + 1)x3 + 0)x2 + 1)x1 + 0
  const init = new Big(0)
  return factoradic
    .slice(0, -1) // Ignore the last element since it's always 0
    .reduce((acc, el, i) => acc.plus(el).times(factoradic.length - 1 - i), init)
}

export function toBase (num, base) {
  let remaining = num
  const result = []
  const zero = new Big(0)

  while (remaining.gt(zero)) {
    const rem = remaining.mod(base)
    result.unshift(parseInt(rem.toFixed()))
    remaining = remaining.minus(rem)
    remaining = remaining.div(base)
  }
  return result
}

export function baseToText (digits, charset) {
  return digits.map(d => charset[d]).join('')
}

export default function decode (deck, cardIndexes, charset, length) {
  const perm = deckToPermutation(deck, cardIndexes)
  const fact = permutationToFactoradic(perm)
  const n = factoradicToNumber(fact)
  const digits = toBase(n, charset.length)
  let text = baseToText(digits, charset)
  while (text.length < length) text = charset[0] + text
  return text
}
