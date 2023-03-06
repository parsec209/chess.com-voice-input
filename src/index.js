let continueRecording = false;
let lastUrl = null;
const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();


const getInputField = () => {
  const i = document.createElement('input');
  i.setAttribute('type', 'text');
  i.setAttribute('id', 'coordinate-input');
  i.style.marginRight = '1%';
  i.style.marginLeft = '0.2%';
  i.style.marginBottom = '0.2%';
  i.style.marginTop = '0.2%';
  return i;
};


const getInputLabel = () => {
  const l = document.createElement('label');
  const t = document.createTextNode('Enter two-digit coordinates');
  l.appendChild(t);
  l.setAttribute('for', 'coordinate-input');
  l.style.marginRight = '5%';
  return l;
};


const getSeparatorText = () => {
  const s = document.createElement('strong');
  const t = document.createTextNode('OR');
  s.appendChild(t);
  s.style.marginRight = '5%';
  return s;
};


const getSpeechBtn = () => {
  const b = document.createElement('button');
  b.setAttribute('id', 'speechBtn');
  b.style.marginRight = '1%';
  const i = document.createElement('i');
  i.setAttribute('id', 'speechIcon');
  i.className = 'fa fa-microphone';
  b.appendChild(i);
  return b;
};


const getSpeechBtnDescription = () => {
  const t = document.createTextNode('Announce two-digit coordinates');
  return t;
};


const getCoordDisplayBtn = () => {
  const b = document.createElement('button');
  b.setAttribute('id', 'coord-display-btn');
  const t = document.createTextNode('Toggle number/letter column coords');
  b.appendChild(t);
  return b;
};


const injectCSSLink = (URL) => {
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', URL);
  document.querySelector('head').appendChild(link);
};


const injectCoordInputSect = () => {
  const boardLayout = document.getElementById('board-layout-main');
  const d = document.createElement('div');
  d.setAttribute('id', 'coord-input-sect');
  const elements = [getInputField(), getInputLabel(), getSeparatorText(), getSpeechBtn(), getSpeechBtnDescription()];
  elements.forEach((e) => {
    d.appendChild(e);
  });
  d.style.display = 'flex';
  d.style.backgroundColor = 'white';
  d.style.marginBottom = '2%';
  d.style.marginTop = '2%';
  boardLayout.appendChild(d);
};


const injectCoordDisplaySect = () => {
  const boardLayout = document.getElementById('board-layout-main');
  const d = document.createElement('div');
  d.setAttribute('id', 'coord-display-sect');
  d.style.display = 'flex';
  d.style.paddingBottom = '5%';
  d.appendChild(getCoordDisplayBtn());
  boardLayout.appendChild(d);
};


const removeCoordInputSect = () => {
  const coordInputSect = document.getElementById('coord-input-sect');
  if (coordInputSect) {
    coordInputSect.remove();
  }
};


const removeCoordDisplaySect = () => {
  const coordDisplaySect = document.getElementById('coord-display-sect');
  if (coordDisplaySect) {
    coordDisplaySect.remove();
  }
};


const injectHTMLIntoValidURL = () => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    removeCoordDisplaySect();
    removeCoordInputSect();
    continueRecording = false;
    recognition.stop();
    const validURLs = [
      'https://www.chess.com/analysis/game/live/',
      'https://www.chess.com/game/live/',
      'https://www.chess.com/analysis/game/daily/',
      'https://www.chess.com/game/daily/',
    ];
    validURLs.forEach((validURL) => {
      if (url.includes(validURL)) {
        injectCoordInputSect();
        injectCoordDisplaySect();
      }
    });
  }
};


const setSpeechRecognition = (eventTarget) => {
  const speechIcon = eventTarget.id === 'speechBtn' ? eventTarget.children[0] : eventTarget;
  if (speechIcon.style.color === 'red') {
    speechIcon.style.color = 'black';
    continueRecording = false;
    recognition.stop();
  } else {
    speechIcon.style.color = 'red';
    continueRecording = true;
    recognition.start();
  }
};


const getEventCoords = (coordinateValue) => {
  const board = document.getElementsByClassName('board')[0];
  let clientX;
  let clientY;
  const boardCoords = board.getBoundingClientRect();
  const squareLength = (1 / 8) * boardCoords.width;
  const widthCoord = parseInt(coordinateValue[0] === '0' ? coordinateValue[1] : coordinateValue[0], 10);
  const lengthCoord = parseInt(coordinateValue[2] === '0' ? coordinateValue[3] : coordinateValue[1], 10);

  if (!board.classList.contains('flipped')) {
    clientX = boardCoords.left + widthCoord * squareLength - (1 / 2) * squareLength;
    clientY = boardCoords.bottom - lengthCoord * squareLength + (1 / 2) * squareLength;
  } else {
    clientX = boardCoords.right - widthCoord * squareLength + (1 / 2) * squareLength;
    clientY = boardCoords.top + lengthCoord * squareLength - (1 / 2) * squareLength;
  }
  return { clientX, clientY };
};


const clickSquare = (eventCoords, coordinateValue) => {
  const board = document.getElementsByClassName('board')[0];
  const { clientX, clientY } = eventCoords;
  const eventOptions = {
    view: window, bubbles: true, cancelable: true, clientX, clientY,
  };

  // The board square class may differ depending on the chess.com page. Two of them are identified here.
  const pieceSquareTwoDigits = document.querySelector(`.square-${coordinateValue}`);
  const pieceSquareFourDigits = document.querySelector(`.square-0${coordinateValue[0]}0${coordinateValue[1]}`);

  // Clicking the originating square.
  if (pieceSquareTwoDigits) {
    pieceSquareTwoDigits.dispatchEvent(new PointerEvent('pointerdown', eventOptions));
    pieceSquareTwoDigits.dispatchEvent(new PointerEvent('pointerup', eventOptions));
  } else if (pieceSquareFourDigits) {
    pieceSquareFourDigits.dispatchEvent(new MouseEvent('mousedown', eventOptions));
    pieceSquareFourDigits.dispatchEvent(new MouseEvent('mouseup', eventOptions));

  // Clicking the destination square.
  } else if (board.classList.contains('v-board')) {
    board.dispatchEvent(new MouseEvent('mousedown', eventOptions));
    board.dispatchEvent(new MouseEvent('mouseup', eventOptions));
  } else {
    board.dispatchEvent(new PointerEvent('pointerdown', eventOptions));
    board.dispatchEvent(new PointerEvent('pointerup', eventOptions));
  }
};


const findSquareAndClick = (coordinateValue) => {
  const numeralCoordinateValue = parseInt(coordinateValue, 10);
  // Only accepts integers between 11-88 (inclusive), and excluding numbers containing a zero or nine.
  if (numeralCoordinateValue >= 11 && numeralCoordinateValue <= 88 && !coordinateValue.includes('9') && !coordinateValue.includes('0')) {
    const eventCoords = getEventCoords(coordinateValue);
    clickSquare(eventCoords, coordinateValue);
  }
};


const changeBoardCoords = () => {
  const coordsSection = document.getElementsByClassName('coordinates')[0];
  if (coordsSection) {
    const coords = [...coordsSection.children];
    const columnCoords = coords.slice(8);
    const columnCoordsAreNumbers = !!parseInt(columnCoords[0].textContent, 10);
    const letters = 'abcdefgh';
    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i];
      if (!columnCoordsAreNumbers) {
        columnCoords.find((columnCoord) => columnCoord.textContent === letter).textContent = i + 1;
      } else {
        columnCoords.find((columnCoord) => columnCoord.textContent === (i + 1).toString()).textContent = letter;
      }
    }
  }
};


window.addEventListener('load', () => {
  injectCSSLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
  new MutationObserver(injectHTMLIntoValidURL).observe(document, { subtree: true, childList: true });
});


document.addEventListener('click', (e) => {
  if (e.target.id === 'speechBtn' || e.target.id === 'speechIcon') {
    setSpeechRecognition(e.target, recognition);
  }
  if (e.target.id === 'coord-display-btn') {
    changeBoardCoords();
  }
});


document.addEventListener('input', (e) => {
  if (e.target.id === 'coordinate-input') {
    // The moment two characters (not including white spaces) are entered, the value is stored and the input field is automatically cleared.
    const coordinateValue = e.target.value.replace(/ /g, '');
    if (coordinateValue.length >= 2) {
      e.target.value = '';
    }
    findSquareAndClick(coordinateValue);
  }
});


recognition.onend = () => {
  if (continueRecording) {
    recognition.start();
  }
};


recognition.onresult = (e) => {
  const coordinateValue = e.results[0][0].transcript;
  findSquareAndClick(coordinateValue);
};
