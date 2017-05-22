import decode from './decode'
import encode from './encode'

const { floor, log } = Math

export const Charsets = {
  ALPHANUMERIC: [
    ' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2',
    '3', '4', '5', '6', '7', '8', '9', '.', ','
  ]
}

export const Decks = {
  NO_JOKERS: [
    'sa', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 'sj', 'sq', 'sk',
    'da', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'dj', 'dq', 'dk',
    'ca', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'cj', 'cq', 'ck',
    'ha', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h10', 'hj', 'hq', 'hk'
  ]
}

export default function Codeck (deck, charset) {
  if (!(this instanceof Codeck)) return new Codeck(deck, charset)

  this.deck = deck || Decks.NO_JOKERS
  this.charset = charset || Charsets.ALPHANUMERIC

  this.charIndexes = {}
  this.cardIndexes = {}

  this.charset.forEach((c, i) => { this.charIndexes[c] = i })
  this.deck.forEach((card, i) => { this.cardIndexes[card] = i })

  let factorial = this.deck.reduce((acc, el, i) => acc * (i + 1), 1)
  this.maxLength = floor(log(factorial) / log(this.charset.length))
}

Codeck.prototype.encode = function (text) {
  return encode(text, this.charIndexes, this.deck)
}

Codeck.prototype.decode = function (deck) {
  return decode(deck, this.cardIndexes, this.charset, this.maxLength)
}
