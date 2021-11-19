/********************************************************************************
 * Scramble
 * creates a constructor for the game
 *******************************************************************************/
function Scramble(topic) {

  // variables declaration
  this.board = [
    [null,1,null,null,null,null,null,null,null,null,null,null,null,null,null],
    [null,1,null,null,null,null,1,1,1,null,null,null,1,1,null],
    [null,null,null,null,null,null,null,1,null,null,null,null,null,1,1],
    [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    [1,1,null,null,1,null,null,null,null,null,1,1,null,null,null],
    [null,null,null,null,1,1,null,null,null,null,null,1,null,null,1],
    [null,null,null,1,null,null,null,null,null,null,null,1,null,null,null],
  ];
  this.topic = topic;
  this.words = {};
  this.wordsDictionary = {};
  this.scrambleWord = "";
  this.letter = "";
  this.userWord = "";
  this.validUserWord = false;
  this.letterPositions = {};
  this.positions = [];
  this.score = 0;
  this.won   = false;
  this.lost  = false;

  // METHODS
  this._displayLetter();
  this._createDictionary(this.topic);
}

/********************************************************************************
 * METHODS
 *******************************************************************************/

/********************************************************************************
 * _createDictionary
 * creates a dictionary object where keys are the topic words and values represent
 * the number of time the user enters the word
 *******************************************************************************/
Scramble.prototype._createDictionary = function (topic) {
    var that = this;
    topic.forEach(function(word) {
      var wordUpCase = word.toUpperCase();
      that.wordsDictionary[wordUpCase] = 0;
    });
    console.log(that.wordsDictionary);
  };

/********************************************************************************
 * _getAvailablePosition
 * checks the board for available positions. This method will iterate over the 
 * board, get the available positions, and return a random available position.
 *******************************************************************************/
Scramble.prototype._getAvailablePosition = function () {
  var emptyTiles = [];
  /**
   * iterates over all the positions in the board array, and when find an empty position, 
   * pushes its coordinates into the emptyTiles array. Once having all the empty positions, 
   * returns one of them randomly. If there are no empty positions, we return false.
   */
  this.board.forEach(function(row, rowIndex){
    row.forEach(function(elem, colIndex){
      if (!elem)
        emptyTiles.push({ x: rowIndex, y: colIndex });
    });
  });

  if (emptyTiles.length === 0)
    return false;

  var randomPosition = Math.floor(Math.random() * emptyTiles.length);
  return emptyTiles[randomPosition];
};

/********************************************************************************
 * _displayLetter
 * for each word in the words array this method set the word toUpperCase
 * splits each word to get an array of letters. For each letter look
 * for an available position in the game board and display it. 
 *******************************************************************************/
Scramble.prototype._displayLetter = function () {
  var that = this;
  this.topic.forEach(function(element) {
    that.scrambleWord = element.toUpperCase();
    var splitWord = that.scrambleWord.split(""); 

    splitWord.forEach(function(letter) {      
      var emptyTile = that._getAvailablePosition();
      //console.log(emptyTile);
      if (emptyTile) {
        that.board[emptyTile.x][emptyTile.y] = letter;
      }            
    });        
  });   
};

/********************************************************************************
 * _askWord
 * receive as a parameter the user’s word. Once received the word, check if the 
 * word is in the dictionary words. if yes, splip it.
 * Once splitted  and check out if the letters of the word are present in the
 * board. 
 *******************************************************************************/
Scramble.prototype._askWord = function (wordInserted) {
  var that = this;
  var wordUpCase = "";
  var splitWord = "";

  if (that.wordsDictionary.hasOwnProperty(wordInserted)) {
    console.log('word inserted is a key');

    // add number of times user's word was entered
    that.wordsDictionary[wordInserted] += 1;
    console.log(that.wordsDictionary[wordInserted]);

    if (that.wordsDictionary[wordInserted] === 1) {
      console.log('valid word counts once');
      splitWord = wordInserted.split("");
      console.log(splitWord);
      that.getWordCoordinates(splitWord);
      return true;
    }
  }
};

/********************************************************************************
 * getWordCoordinates
 * Iterates over the board to look for each letter and when find a letter 
 * create a key of the letterPositions object and for that key pushes its 
 * coordinates into the letterPositions value array of objects.
 *******************************************************************************/
Scramble.prototype.getWordCoordinates = function name(splitWord) {
  var that = this;
  splitWord.forEach(function(letter) {
    that.board.forEach(function(row, rowIndex){
      row.forEach(function(elem, colIndex){
        if (elem === letter){
          // this doesn't overwrite the key. That way
          // always we get the first occurence of the letter
          if (!that.letterPositions[elem]) {
              that.letterPositions[elem] = [];
          }
          var obj = {};
          obj.x = rowIndex;
          obj.y = colIndex;
          // add all coordinates where there is a letter found
          that.letterPositions[elem].push(obj);                
          }
        });
     });
  });
  console.log(that.letterPositions);
  that.removeLetter(); 
  that.letterPositions = {};
};

/********************************************************************************
 * removeLetter
 * receive the positions of the letters in the letterFounds array and iterates 
 * over the board to remove each letter.
 *******************************************************************************/
Scramble.prototype.removeLetter = function name() {
  var that = this;
  that.positions = Object.values(that.letterPositions);
  // console.log(positions);
  that.positions.forEach(function(position) {
    if (position.length > 0) {
      console.log(position[0]);
      that.board[position[0].x][position[0].y] = null;
      console.log(that.board[position[0].x][position[0].y]);
    }
  });
};

/********************************************************************************
 * _renderBoard
 * prints the game board to the console. 
 * iterates over the board rows and prints the full array that we have in 
 * each row.
 *******************************************************************************/
Scramble.prototype._renderBoard = function () {
  this.board.forEach(function(row){ console.log(row); });      
};


// var game = new Scramble();
// game._renderBoard();


