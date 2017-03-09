import Codeck from './Codeck';

const messageEl = document.getElementById('message');
const cardsEl = document.getElementById('cards');

const codeck = new Codeck();

messageEl.onkeyup = function(e) {
  const message = e.target.value.toLowerCase();
  const cards = codeck.encode(message);
  cardsEl.innerHTML = cards.join(', ');
};
