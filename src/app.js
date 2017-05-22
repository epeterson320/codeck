import { select, event as currentEvent } from 'd3-selection'
import { drag } from 'd3-drag'
import 'd3-transition' // defines selection.transition()
import Codeck from './Codeck'

import '../styles/main.scss'

const { floor } = Math
const codeck = new Codeck()

// These values should be matched in .scss files
const pageMargin = 16
const margin = 4
const maxWidth = Math.min(512, window.innerWidth - 2 * pageMargin)
const cardWidth = 40
const cardHeight = 60

const nCols = Math.floor((maxWidth - 2 * margin) / cardWidth)
const nRows = Math.ceil(codeck.deck.length / nCols)
const height = nRows * cardHeight + 2 * margin
const width = nCols * cardWidth + 2 * margin

const cardsDiv = select('#cards')
  .style('width', `${width}px`)
  .style('height', `${height}px`)

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
  return text
    .replace(/[!?]+/g, '.') // replace !, ?, !!, or !?!?! with a single period.
    .replace(/[^A-Z0-9,. ]/g, '')
}

function updateMessage () {
  const typedMessage = messageInput.node().value.toUpperCase().trim()
  const cleanedMessage = cleanMessage(typedMessage)
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
  if (card.idx + di >= cardOrder.length || card.idx + di < 0) return false
  if (card.idx % nCols === nCols - 1 && di === 1) return false
  if (card.idx % nCols === 0 && di === -1) return false

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
  return true
}

function renderCards () {
  cardsDiv.selectAll('.card').transition()
    .delay(d => d.idx * 5)
    .filter(d => !d.dragging)
    .style('left', d => `${d.idx % nCols * cardWidth + d.dx + margin}px`)
    .style('top', d => `${floor(d.idx / nCols) * cardHeight + d.dy + margin}px`)
}

function dragstarted (d) {
  d.dragging = true
  currentEvent.sourceEvent.preventDefault()
  select(this)
    .classed('drag', true)
    .raise()
}

function dragged (d) {
  d.dx += currentEvent.dx
  d.dy += currentEvent.dy
  if (d.dx > cardWidth / 2) {
    d.dx -= cardWidth
    const moved = moveCard(d, 1)
    if (!moved) d.dx += cardWidth
  } else if (d.dx < -cardWidth / 2) {
    d.dx += cardWidth
    const moved = moveCard(d, -1)
    if (!moved) d.dx -= cardWidth
  }
  if (d.dy > cardHeight / 2) {
    d.dy -= cardHeight
    const moved = moveCard(d, nCols)
    if (!moved) d.dy += cardHeight
  } else if (d.dy < -cardHeight / 2) {
    d.dy += cardHeight
    const moved = moveCard(d, -nCols)
    if (!moved) d.dy -= cardHeight
  }
  select(this)
    .style('left', d => `${d.idx % nCols * cardWidth + d.dx + margin}px`)
    .style('top', d => `${floor(d.idx / nCols) * cardHeight + d.dy + margin}px`)
}

function dragended (d) {
  d.dx = 0
  d.dy = 0
  d.dragging = false
  select(this).classed('drag', false)
  renderCards()
  const message = codeck.decode(cardOrder)
  messageInput.node().value = message.trim().toUpperCase()
  cleanedMessageSpan.classed('hide', true)
}

function showCardsInit () {
  cardsDiv.selectAll('.card')
    .data(Object.values(cards), card => card.key)
    .enter().append('div')
      .classed('card', true)
      .style('top', '0')
      .style('left', '0')
      .each(function (d) { select(this).classed(d.key, true) })
      .call(drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
  renderCards()
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('worker.js')
  })
}

showCardsInit()
