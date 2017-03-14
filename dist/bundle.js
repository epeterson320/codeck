(function (d3,Big) {
'use strict';

Big = 'default' in Big ? Big['default'] : Big;

function deckToPermutation(deck, cardIndexes) {
  return deck.map(function (card) {
    return cardIndexes[card];
  });
}

function permutationToFactoradic(_permutation) {
  var permutation = _permutation.slice(); // Copy since it will be mutated.
  var factoradic = new Array(permutation.length);
  var lastIdx = permutation.length - 1;
  for (var i = 0; i <= lastIdx; i++) {
    var el = permutation[i];
    factoradic[i] = el;
    for (var j = i + 1; j <= lastIdx; j++) {
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
  var init = new Big(0);
  return factoradic.slice(0, -1) // Ignore the last element since it's always 0
  .reduce(function (acc, el, i) {
    return acc.plus(el).times(factoradic.length - 1 - i);
  }, init);
}

function toBase(num, base) {
  var remaining = num;
  var result = [];
  var zero = new Big(0);

  while (remaining.gt(zero)) {
    var rem = remaining.mod(base);
    result.unshift(parseInt(rem.toFixed()));
    remaining = remaining.minus(rem);
    remaining = remaining.div(base);
  }
  return result;
}

function baseToText(digits, charset) {
  return digits.map(function (d) {
    return charset[d];
  }).join('');
}

function decode(deck, cardIndexes, charset, length) {
  var perm = deckToPermutation(deck, cardIndexes);
  var fact = permutationToFactoradic(perm);
  var n = factoradicToNumber(fact);
  var digits = toBase(n, charset.length);
  var text = baseToText(digits, charset);
  while (text.length < length) {
    text = charset[0] + text;
  }return text;
}

function textToBase(text, charIndexes) {
  return text.split('').map(function (c) {
    return charIndexes[c];
  });
}

function baseToNumber(digits, base) {
  var init = new Big(0);
  return digits.reduce(function (acc, el) {
    return acc.plus(el).times(base);
  }, init).div(base);
}

function numberToFactoradic(number) {
  var radix = 1;
  var remaining = number;
  var factoradic = [];
  var zero = new Big(0);
  while (remaining.gt(zero)) {
    var digit = remaining.mod(radix);
    factoradic.unshift(parseInt(digit.toFixed()));
    remaining = remaining.div(radix).round(0, 0);
    radix++;
  }
  return factoradic;
}

function factoradicToPermutation(_factoradic, sorted) {
  var factoradic = _factoradic.slice();
  while (factoradic.length < sorted.length) {
    factoradic.unshift(0);
  }var remaining = sorted;
  return factoradic.map(function (digit) {
    var el = remaining[digit];
    remaining = remaining.filter(function (el, i) {
      return i != digit;
    });
    return el;
  });
}

function permutationToDeck(permutation, cardOrder) {
  return permutation.map(function (i) {
    return cardOrder[i];
  });
}

function encode(text, charIndexes, cardOrder) {
  var digits = textToBase(text, charIndexes);
  var n = baseToNumber(digits, Object.keys(charIndexes).length);
  var fact = numberToFactoradic(n);
  var perm = factoradicToPermutation(fact, cardOrder.map(function (el, i) {
    return i;
  }));
  return permutationToDeck(perm, cardOrder);
}

var floor$1 = Math.floor;
var log = Math.log;


var Charsets = {
  ALPHANUMERIC: [' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',']
};

var Decks = {
  NO_JOKERS: ['🂡', '🂢', '🂣', '🂤', '🂥', '🂦', '🂧', '🂨', '🂩', '🂪', '🂫', '🂭', '🂮', '🃁', '🃂', '🃃', '🃄', '🃅', '🃆', '🃇', '🃈', '🃉', '🃊', '🃋', '🃍', '🃎', '🃑', '🃒', '🃓', '🃔', '🃕', '🃖', '🃗', '🃘', '🃙', '🃚', '🃛', '🃝', '🃞', '🂱', '🂲', '🂳', '🂴', '🂵', '🂶', '🂷', '🂸', '🂹', '🂺', '🂻', '🂽', '🂾']
};

function Codeck(deck, charset) {
  var _this = this;

  if (!(this instanceof Codeck)) return new Codeck(deck, charset);

  this.deck = deck || Decks.NO_JOKERS;
  this.charset = charset || Charsets.ALPHANUMERIC;

  this.charIndexes = {};
  this.cardIndexes = {};

  this.charset.forEach(function (c, i) {
    _this.charIndexes[c] = i;
  });
  this.deck.forEach(function (card, i) {
    _this.cardIndexes[card] = i;
  });

  var factorial = this.deck.reduce(function (acc, el, i) {
    return acc * (i + 1);
  }, 1);
  this.maxLength = floor$1(log(factorial) / log(this.charset.length));
}

Codeck.prototype.encode = function (text) {
  return encode(text, this.charIndexes, this.deck);
};

Codeck.prototype.decode = function (deck) {
  return decode(deck, this.cardIndexes, this.charset, this.maxLength);
};

var floor = Math.floor;

var codeck = new Codeck();

var svg = d3.select('#cards svg').attr('width', '600px').attr('height', '400px');

var messageInput = d3.select('#message');
var cleanedMessageSpan = d3.select('.cleanednotification');

messageInput.node().maxLength = codeck.maxLength;
messageInput.node().size = codeck.maxLength;

var cards = {};
codeck.deck.forEach(function (key, idx) {
  cards[key] = { key: key, idx: idx, dragging: false, dx: 0, dy: 0 };
});

var cardOrder = codeck.deck.slice(); // copy of deck.

var debounceInputId = -1;
messageInput.on('keyup', function () {
  clearTimeout(debounceInputId);
  debounceInputId = setTimeout(updateMessage, 300);
});

function cleanMessage(text) {
  return text.toUpperCase().trim().replace(/['"]/g, ',').replace(/[!?]/g, '.').replace(/[^A-Z0-9,. ]/g, '');
}

function updateMessage() {
  var typedMessage = messageInput.node().value;
  var cleanedMessage = cleanMessage(messageInput.node().value);
  var newOrder = codeck.encode(cleanedMessage.toLowerCase());
  newOrder.forEach(function (cardKey, i) {
    cardOrder[i] = cardKey;
    cards[cardKey].idx = i;
  });
  if (typedMessage === cleanedMessage) {
    cleanedMessageSpan.classed('hide', true);
  } else {
    cleanedMessageSpan.classed('hide', false).select('span').text(cleanedMessage);
  }
  renderCards();
}

function moveCard(card, di) {
  if (card + di > cardOrder.length || card + di < 0) return;

  if (di > 0) {
    for (var i = card.idx; i < card.idx + di; i++) {
      cardOrder[i] = cardOrder[i + 1];
      cards[cardOrder[i]].idx = i;
    }
  } else if (di < 0) {
    for (var _i = card.idx; _i > card.idx + di; _i--) {
      cardOrder[_i] = cardOrder[_i - 1];
      cards[cardOrder[_i]].idx = _i;
    }
  }
  cardOrder[card.idx + di] = card.key;
  card.idx += di;
  renderCards();
}

function renderCards() {
  svg.selectAll('.card').transition().delay(function (d) {
    return d.idx * 5;
  }).filter(function (d) {
    return !d.dragging;
  }).attr('transform', function (d) {
    return 'translate(' + (d.idx % 9 * 48 + d.dx) + ', ' + (floor(d.idx / 9) * 60 + d.dy) + ')';
  });
}

function dragstarted(d) {
  d.dragging = true;
  d3.select(this).style('filter', 'url(#shadow)');
}

function dragged(d) {
  d.dx += d3.event.dx;
  d.dy += d3.event.dy;
  if (d.dx > 28) {
    d.dx -= 48;
    moveCard(d, 1);
  } else if (d.dx < -28) {
    d.dx += 48;
    moveCard(d, -1);
  }
  if (d.dy > 34) {
    d.dy -= 60;
    moveCard(d, 9);
  } else if (d.dy < -34) {
    d.dy += 60;
    moveCard(d, -9);
  }
  d3.select(this).attr('transform', function (d) {
    return 'translate(' + (d.idx % 9 * 48 + d.dx) + ', ' + (floor(d.idx / 9) * 60 + d.dy) + ')';
  });
}

function dragended(d) {
  d.dx = 0;
  d.dy = 0;
  d.dragging = false;
  d3.select(this).style('filter', null);
  renderCards();
  var message = codeck.decode(cardOrder);
  messageInput.node().value = message.trim().toUpperCase();
  cleanedMessageSpan.classed('hide', true);
}

function showCardsInit() {
  svg.selectAll('.card').data(Object.values(cards), function (card) {
    return card.key;
  }).enter().append('text').attr('class', 'card').attr('transform', 'translate(0, 0)').text(function (card) {
    return card.key;
  }).attr('y', 60).attr('fill', function (d) {
    return floor(d.idx / 13) % 2 !== 0 ? 'red' : 'black';
  }).call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended));
  renderCards();
}

setTimeout(showCardsInit, 300);

}(d3,Big));
