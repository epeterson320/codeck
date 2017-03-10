import * as d3 from 'd3';
import Codeck from './Codeck';

const { floor } = Math;
const codeck = new Codeck();

const svg = d3.select('#cards')
  .append('svg')
  .attr('width', '600px')
  .attr('height', '400px');

let cardsState = codeck.deck;
let messageState = '';
let timeoutID = -1;

d3.select('#message').on('keyup', function() {
  messageState = this.value;
  clearTimeout(timeoutID);
  timeoutID = setTimeout(updateMessage, 300);
});

function updateMessage() {
  const message = messageState.toLowerCase().trim();
  cardsState = codeck.encode(message);
  renderCards();
}

function renderCards() {
  const cards = svg.selectAll('.card')
    .data(cardsState, c => c);

  cards
    .enter().append('text')
      .attr('class', 'card')
      .attr('transform', 'translate(0, 0)')
      .text(d => d)
      .attr('y', 60)
      .attr('fill', (d, i) => (i > 26) ? 'red' : 'black')
    .merge(cards)
      .transition()
        .delay((d, i) => i * 5)
        .attr('transform', (d) => {
          const i = cardsState.indexOf(d);
          return `translate(${(i % 9) * 48}, ${60 * floor(i / 9)})`;
        });
}

timeoutID = setTimeout(renderCards, 300);
