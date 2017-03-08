export const Charsets = {
  ALPHANUMERIC: [
    ' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2',
    '3', '4', '5', '6', '7', '8', '9', '.', ',',
  ],
};

/*export const Decks = {
  NO_JOKERS: [
    'AS', 'KS', 'QS', 'JS', '10S', '9S', '8S', '7S', '6S', '5S', '4S', '3S', '2S',
    'AC', 'KC', 'QC', 'JC', '10C', '9C', '8C', '7C', '6C', '5C', '4C', '3C', '2C',
    'AH', 'KH', 'QH', 'JH', '10H', '9H', '8H', '7H', '6H', '5H', '4H', '3H', '2H',
    'AD', 'KD', 'QD', 'JD', '10D', '9D', '8D', '7D', '6D', '5D', '4D', '3D', '2D',
  ],
};*/

export default function Codeck(deck, charset) {
  if (!(this instanceof Codeck)) return new Codeck(deck, charset);
}

/*Codeck.prototype.textToDeck = function(text) {
  throw new Error('TODO' + text);
};

Codeck.prototype.deckToText = function(deck) {
  throw new Error('TODO' + deck);
};*/
