
const displayWithValidURL = document.getElementById('displayWithValidURL')
const displayWithInvalidURL = document.getElementById('displayWithInvalidURL')
const coordinate = document.getElementById('coordinate')
const displayCoords = document.getElementById('displayCoords')
const errorMsg = document.getElementById('errorMsg')
const board = document.getElementById('board')
const flippedBoard = document.getElementById('flippedBoard')
let isFlipped = false



window.onload = function() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const validURLs = [
      'https://www.chess.com/analysis/game/live/',
      'https://www.chess.com/live',
      'https://www.chess.com/analysis/game/daily/',
      'https://www.chess.com/game/daily/'
    ]
    const matches = validURLs.filter(url => tabs[0].url.includes(url))
    if (matches.length) {
      displayWithValidURL.style.display = 'block'
    } else {
      displayWithInvalidURL.style.display = 'block'
    }
  })
}


coordinate.addEventListener('input', (e) => {
  const value = e.target.value.replace(/ /g,'')
  const numeralValue = parseInt(value, 10)
  if (value.length === 2 && numeralValue >= 11 && numeralValue <= 88 && !value.includes('9') && !value.includes('0')) {
    coordinate.value = ''
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { value }, response => {
        if (response === 'Square clicked') {
          return
        } else {
          console.error('Input not received')
        }
      })
    })
  } else if (value.length < 2) {
    return
  } else {
    coordinate.value = ''
  }
})


displayCoords.addEventListener('click', () => {
  errorMsg.style.display = 'none'
  if ((board.style.display === 'none' || !board.style.display) && (flippedBoard.style.display === 'none' || !flippedBoard.style.display)) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      console.log(tabs[0].url)
      chrome.tabs.sendMessage(tabs[0].id, { request: 'getBoardClassList' }, response => {
        if (response && response.boardClassList) {
          displayCoords.textContent = 'Hide coordinates'
          if (Object.values(response.boardClassList).includes('flipped')) {
            isFlipped = true
            flippedBoard.style.display = 'block'
          } else {
            isFlipped = false
            board.style.display = 'block'
          }
        } else {
          console.error('Unable to get board direction')
          errorMsg.style.display = 'block'
        }
      })
    })
  } else {
    displayCoords.textContent = 'Show coordinates'
    board.style.display = 'none'
    flippedBoard.style.display = 'none'
  }
})

