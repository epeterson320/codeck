(function (Big) {
'use strict';

Big = 'default' in Big ? Big['default'] : Big;

function deckToPermutation(deck, cardIndexes) {
  return deck.map(card => cardIndexes[card]);
}

function permutationToFactoradic(_permutation) {
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

function factoradicToNumber(factoradic) {
  // This works because:
  // factoradic 341010
  // = 3x5! + 4x4! + 1x3! + 0x2! + 1x1! + 0x0!
  // = ((((3x5 + 4)x4 + 1)x3 + 0)x2 + 1)x1 + 0
  const init = new Big(0);
  return factoradic
    .slice(0, -1) // Ignore the last element since it's always 0
    .reduce((acc, el, i) => acc.plus(el).times(factoradic.length - 1 - i), init);
}

function toBase(num, base) {
  let remaining = num;
  const result = [];
  const zero = new Big(0);

  while (remaining.gt(zero)) {
    const rem = remaining.mod(base);
    result.unshift(parseInt(rem.toFixed()));
    remaining = remaining.minus(rem);
    remaining = remaining.div(base);
  }
  return result;
}

function baseToText(digits, charset) {
  return digits.map(d => charset[d]).join('');
}

function decode(deck, cardIndexes, charset, length) {
  const perm = deckToPermutation(deck, cardIndexes);
  const fact = permutationToFactoradic(perm);
  const n = factoradicToNumber(fact);
  const digits = toBase(n, charset.length);
  let text = baseToText(digits, charset);
  while (text.length < length) text = charset[0] + text;
  return text;
}

function textToBase(text, charIndexes) {
  return text.split('').map(c => charIndexes[c]);
}

function baseToNumber(digits, base) {
  const init = new Big(0);
  return digits
    .reduce((acc, el) => acc.plus(el).times(base), init)
    .div(base);
}

function numberToFactoradic(number) {
  let radix = 1;
  let remaining = number;
  const factoradic = [];
  const zero = new Big(0);
  while (remaining.gt(zero)) {
    const digit = remaining.mod(radix);
    factoradic.unshift(parseInt(digit.toFixed()));
    remaining = remaining.div(radix).round(0, 0);
    radix++;
  }
  return factoradic;
}

function factoradicToPermutation(_factoradic, sorted) {
  const factoradic = _factoradic.slice();
  while (factoradic.length < sorted.length) factoradic.unshift(0);

  let remaining = sorted;
  return factoradic.map((digit) => {
    const el = remaining[digit];
    remaining = remaining.filter((el, i) => i != digit);
    return el;
  });
}

function permutationToDeck(permutation, cardOrder) {
  return permutation.map(i => cardOrder[i]);
}

function encode(text, charIndexes, cardOrder) {
  const digits = textToBase(text, charIndexes);
  const n = baseToNumber(digits, Object.keys(charIndexes).length);
  const fact = numberToFactoradic(n);
  const perm = factoradicToPermutation(fact, cardOrder.map((el, i) => i));
  return permutationToDeck(perm, cardOrder);
}

const { floor, log } = Math;

const Charsets = {
  ALPHANUMERIC: [
    ' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2',
    '3', '4', '5', '6', '7', '8', '9', '.', ',',
  ],
};

const Decks = {
  NO_JOKERS: [
    'AS', 'KS', 'QS', 'JS', '10S', '9S', '8S', '7S', '6S', '5S', '4S', '3S', '2S',
    'AC', 'KC', 'QC', 'JC', '10C', '9C', '8C', '7C', '6C', '5C', '4C', '3C', '2C',
    'AH', 'KH', 'QH', 'JH', '10H', '9H', '8H', '7H', '6H', '5H', '4H', '3H', '2H',
    'AD', 'KD', 'QD', 'JD', '10D', '9D', '8D', '7D', '6D', '5D', '4D', '3D', '2D',
  ],
};

function Codeck(deck, charset) {
  if (!(this instanceof Codeck)) return new Codeck(deck, charset);

  this.deck = deck || Decks.NO_JOKERS;
  this.charset = charset || Charsets.ALPHANUMERIC;

  this.charIndexes = {};
  this.cardIndexes = {};

  this.charset.forEach((c, i) => { this.charIndexes[c] = i; });
  this.deck.forEach((card, i) => { this.cardIndexes[card] = i; });

  let factorial = this.deck.reduce((acc, el, i) => acc * (i + 1), 1);
  this.maxLength = floor(log(factorial) / log(this.charset.length));
}

Codeck.prototype.encode = function(text) {
  return encode(text, this.charIndexes, this.deck);
};

Codeck.prototype.decode = function(deck) {
  return decode(deck, this.cardIndexes, this.charset, this.maxLength);
};

const messageEl = document.getElementById('message');
const cardsEl = document.getElementById('cards');

const codeck = new Codeck();

messageEl.onkeyup = function(e) {
  const message = e.target.value.toLowerCase();
  const cards = codeck.encode(message);
  cardsEl.innerHTML = cards.join(', ');
};

}(Big));
