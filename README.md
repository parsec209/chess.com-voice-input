# Chess Voice Assist Extension

## About

This Google Chrome extension can be used on the [chess.com](https://www.chess.com/) site and is meant to facilitate using voice input to 
enter your moves during a game, or during post-game analysis. It does not provide any voice functionality per se, it expects you to already have that 
setup on your system. 


**Its functionality is simple:**

- During a game, you enter (by announcing, but you can also type if you prefer) two-digit coordinates into a small form that will pop up when you click 
  the extension icon. 
- These coordinates correspond to the site's chess board squares, and when entered into the form, will simulate a mouse click on a specific square. 
- You can optionally display a small board image, adjacent to the form, that shows all the coordinates and their corresponding squares.


**But what is the point of using this two-digit coordinate system?** Well...I personally have yet to find a super easy way to input moves into 
[chess.com](https://www.chess.com/) using voice alone. I have used the mouse grid voice command on Windows and Mac, 
which does allow hands-free play, but it's a clumsy experience when playing chess. Secondly, even if you have the option to directly announce your moves 
using standard algebraic notation, this notation is not easy with voice commands. It may confuse similarly-sounding letters, you have to differentiate 
between capital and lower case, too many syllables are needed, etc. The two-digit system used here is easy for voice recognition to understand, and requires
you to just say one number (between 11-88 inclusive, except for numbers containing zeroes or nines). 


## Special notes:

- The moment two characters are entered into the form (regardless of whether these characters are valid or invalid coordinates), the form will automatically
  clear itself. This is intentional, so that you will not have to take the extra step of saying something like "enter that" everytime you want a square 
  clicked.
- You will know whether the value you entered was a valid coordinate if your chosen square looks like a mouse clicked on it. 
- White spaces are not counted toward the form value, so any spaces before, in between, or after a character within the form are simply ignored.
- Flipping the site's board will also flip the coordinate reference board.
- Remember, all the coordinate entry does is simulate a mouse click, it is as if you clicked the square yourself with the mouse. This means you can
  always unclick a square if you entered the wrong coordinate.

Not all of the boards on [chess.com](https://www.chess.com/) will be able to access this extension. The URL must begin with one of the following: 

- https://www.chess.com/analysis/game/live/
- https://www.chess.com/live
- https://www.chess.com/analysis/game/daily/
- https://www.chess.com/game/daily/








 
