import * as d3 from 'd3';
import Codeck from './Codeck';

const { floor } = Math;
const codeck = new Codeck();

const svg = d3.select('#cards')
  .append('svg')
  .attr('width', '600px')
  .attr('height', '400px');

let cards = codeck.deck;
let message = '';
let timeoutID = -1;

d3.select('#message').on('keyup', function() {
  clearTimeout(timeoutID);
  timeoutID = setTimeout(updateCards, 300);
});

function updateCards() {
  message = d3.select('#message').node().value.toLowerCase().trim();
  cards = codeck.encode(message);

  const cardSel = svg.selectAll('.card').data(cards, c => c);

  const newcards = cardSel.enter().append('g').attr('class', 'card');

  /*newcards.append('rect')
    .attr('width', 36)
    .attr('height', 36);*/

  newcards.append('text')
    .text((d) => d)
    //.attr('x', 8)
    .attr('y', 60)
    .attr('fill', (d, i) => (i > 26) ? 'red' : 'black');

  cardSel.transition()
    .delay((d, i) => i * 5)
    .attr('transform', (d) => {
      const i = cards.indexOf(d);
      return `translate(${(i % 9) * 48}, ${60 * floor(i / 9)})`;
    });
}
