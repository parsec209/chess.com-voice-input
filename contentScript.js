

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {

    const board = document.querySelector('.board')

    
    //Request from extension to get the board class list, which determines whether board is flipped or not
    if (request.request === 'getBoardClassList') {
      sendResponse({ boardClassList: board.classList })


    //Coordinate value sent from the extension input field    
    } else if (request.value) {
      //The board square class may differ depending on the Chess.com page. Two of them are identified here:
      const pieceSquareTwoDigits = document.querySelector(`.square-${request.value}`) 
      const pieceSquareFourDigits = document.querySelector(`.square-0${request.value[0]}0${request.value[1]}`)

      //Calculations for getting board square coordinates used in the board click events
      const boardCoords = board.getBoundingClientRect()
      const squareLength = 1/8 * boardCoords.width
      const widthCoord = parseInt(request.value[0] === '0' ? request.value[1] : request.value[0], 10)
      const lengthCoord = parseInt(request.value[2] === '0' ? request.value[3] : request.value[1], 10)
      let clientX
      let clientY
      if (!board.classList.contains('flipped')) {
        clientX = boardCoords.left + widthCoord * squareLength - 1/2 * squareLength
        clientY = boardCoords.bottom - lengthCoord * squareLength + 1/2 * squareLength
      } else {
        clientX = boardCoords.right - widthCoord * squareLength + 1/2 * squareLength
        clientY = boardCoords.top + lengthCoord * squareLength - 1/2 * squareLength
      }
      
      //Board click events
      const eventOptions = { view: window, bubbles: true, cancelable: true, clientX, clientY }

      //When clicking the originating square 
      if (pieceSquareTwoDigits) {
        pieceSquareTwoDigits.dispatchEvent(new PointerEvent('pointerdown', eventOptions))
        pieceSquareTwoDigits.dispatchEvent(new PointerEvent('pointerup', eventOptions))
      } else if (pieceSquareFourDigits) {
        pieceSquareFourDigits.dispatchEvent(new MouseEvent('mousedown', eventOptions))
        pieceSquareFourDigits.dispatchEvent(new MouseEvent('mouseup', eventOptions))

      //When clicking the destination square  
      } else if (board.classList.contains('v-board')) {
        board.dispatchEvent(new MouseEvent('mousedown', eventOptions))
        board.dispatchEvent(new MouseEvent('mouseup', eventOptions))
      } else {
        board.dispatchEvent(new PointerEvent('pointerdown', eventOptions))
        board.dispatchEvent(new PointerEvent('pointerup', eventOptions))
      }

      //Let extension know the square clicked successfully
      sendResponse('Square clicked')
    }
  }
)











