import {
  select,
  event as currentEvent
} from 'd3-selection'
import { drag } from 'd3-drag'
import 'd3-transition' // defines selection.transition()

import Codeck from './Codeck'

const { floor } = Math
const codeck = new Codeck()

const svg = select('#cards svg')
  .attr('width', '512px')
  .attr('height', '400px')

const messageInput = select('#message')
const cleanedMessageSpan = select('.cleanednotification')

messageInput.node().maxLength = codeck.maxLength
messageInput.node().size = codeck.maxLength

const cards = {}
codeck.deck.forEach((key, idx) => {
  cards[key] = { key, idx, dragging: false, dx: 0, dy: 0 }
})

const cardOrder = codeck.deck.slice() // copy of deck.

let debounceInputId = -1
messageInput.on('keyup', () => {
  clearTimeout(debounceInputId)
  debounceInputId = setTimeout(updateMessage, 25)
})

function cleanMessage (text) {
  return text.toUpperCase().trim()
    .replace(/[!?]+/g, '.') // replace !, ?, !!, or !?!?! with a single period.
    .replace(/[^A-Z0-9,. ]/g, '')
}

function updateMessage () {
  const typedMessage = messageInput.node().value
  const cleanedMessage = cleanMessage(messageInput.node().value)
  const newOrder = codeck.encode(cleanedMessage.toLowerCase())
  newOrder.forEach((cardKey, i) => {
    cardOrder[i] = cardKey
    cards[cardKey].idx = i
  })
  if (typedMessage === cleanedMessage) {
    cleanedMessageSpan.classed('hide', true)
  } else {
    cleanedMessageSpan
      .classed('hide', false)
      .select('samp')
        .text(cleanedMessage)
  }
  renderCards()
}

function moveCard (card, di) {
  if (card + di > cardOrder.length || card + di < 0) return

  if (di > 0) {
    for (let i = card.idx; i < card.idx + di; i++) {
      cardOrder[i] = cardOrder[i + 1]
      cards[cardOrder[i]].idx = i
    }
  } else if (di < 0) {
    for (let i = card.idx; i > card.idx + di; i--) {
      cardOrder[i] = cardOrder[i - 1]
      cards[cardOrder[i]].idx = i
    }
  }
  cardOrder[card.idx + di] = card.key
  card.idx += di
  renderCards()
}

function renderCards () {
  svg.selectAll('.card').transition()
    .delay(d => d.idx * 5)
    .filter(d => !d.dragging)
    .attr('transform', d =>
      `translate(${d.idx % 9 * 48 + d.dx}, ${floor(d.idx / 9) * 60 + d.dy})`)
}

function dragstarted (d) {
  d.dragging = true
  currentEvent.sourceEvent.preventDefault()
  select(this)
    .style('filter', 'url(#shadow)')
    .raise()
}

function dragged (d) {
  d.dx += currentEvent.dx
  d.dy += currentEvent.dy
  if (d.dx > 28) {
    d.dx -= 48
    moveCard(d, 1)
  } else if (d.dx < -28) {
    d.dx += 48
    moveCard(d, -1)
  }
  if (d.dy > 34) {
    d.dy -= 60
    moveCard(d, 9)
  } else if (d.dy < -34) {
    d.dy += 60
    moveCard(d, -9)
  }
  select(this).attr('transform', d =>
    `translate(${d.idx % 9 * 48 + d.dx}, ${floor(d.idx / 9) * 60 + d.dy})`)
}

function dragended (d) {
  d.dx = 0
  d.dy = 0
  d.dragging = false
  select(this).style('filter', null)
  renderCards()
  const message = codeck.decode(cardOrder)
  messageInput.node().value = message.trim().toUpperCase()
  cleanedMessageSpan.classed('hide', true)
}

function showCardsInit () {
  svg.selectAll('.card')
    .data(Object.values(cards), card => card.key)
    .enter().append('g')
      .attr('class', 'card')
      .attr('transform', 'translate(0, 0)')
      .each(function () {
        const g = select(this)
        g.append('rect')
          .attr('fill', 'white')
          .style('width', 36)
          .style('height', 46)
        g.append('text')
          .text(card => card.key)
          .attr('y', 40)
          .attr('fill', d => (floor(d.idx / 13) % 2 !== 0) ? 'red' : 'black')
      })
      .call(drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
  renderCards()
}

setTimeout(showCardsInit, 25)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('worker.js')
  })
}
