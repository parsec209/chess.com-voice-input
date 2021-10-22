const displayWithValidURL = document.getElementById('displayWithValidURL')
const displayWithInvalidURL = document.getElementById('displayWithInvalidURL')
const coordinate = document.getElementById('coordinate')
const displayCoords = document.getElementById('displayCoords')
const errorMsg = document.getElementById('errorMsg')
const board = document.getElementById('board')
const flippedBoard = document.getElementById('flippedBoard')
let isFlipped = false



//Loads the move input interface only within the specified URLs; otherwise the interface will display a message listing the valid URLs 
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


//Listener for the coordinate input field, which will send the coordinate values to the content script
coordinate.addEventListener('input', (e) => {
  //White spaces can be entered, but are ignored in the final value
  const value = e.target.value.replace(/ /g,'')
  const numeralValue = parseInt(value, 10)
  //The moment two characters (not including white spaces) are entered, the value is stored and the input field is automatically emptied  
  //This saves the user from having to manually press or say enter 
  //Only two digit integers between 11-88 (inclusive), and excluding numbers containing a zero or nine, will be sent to the content script, everything else will be ignored
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


//A button that either displays or hides the coordinate board when clicked
displayCoords.addEventListener('click', () => {
  errorMsg.style.display = 'none'

  //If coordinate board is hidden, button click will display the board  
  if ((board.style.display === 'none' || !board.style.display) && (flippedBoard.style.display === 'none' || !flippedBoard.style.display)) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      //Request is sent to the content script to get the class list for the board; this will let the extension know whether the board is flipped or not 
      chrome.tabs.sendMessage(tabs[0].id, { request: 'getBoardClassList' }, response => {
        if (response && response.boardClassList) {
          displayCoords.textContent = 'Hide coordinates'
          //If board is flipped, the coordinate board will be displayed from black's perspective
          if (Object.values(response.boardClassList).includes('flipped')) {
            isFlipped = true
            flippedBoard.style.display = 'block'
          //Otherwise, the coordinate board will be displayed from white's perspective
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
    
  //If coordinate board is displayed, button click will hide the board
  } else {
    displayCoords.textContent = 'Show coordinates'
    board.style.display = 'none'
    flippedBoard.style.display = 'none'
  }
})

