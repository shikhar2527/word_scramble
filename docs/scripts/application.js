//**************************************************************
// getTimeRemaining
// set the time of the game creating an object from a Date Object
//**************************************************************

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  return {
    'total': t,
    'minutes': minutes,
    'seconds': seconds
  };
}

//**************************************************************
// initializeClock
// displays the time of the game in the screen.
// use a timeinterval function to display every 1 seconds
//**************************************************************

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t = getTimeRemaining(endtime);
    // console.log(t);

    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    // once the timer reaches zero: we reset tiles and 
    // display game over
    if (t.total <= 0) {
      clearInterval(timeinterval);
      resetTiles();
      gameOver();
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

//**************************************************************
// setTimerZero
// sets the timer to zero before game starts
//**************************************************************
function setTimerZero() {
    var clock = document.getElementById('clockdiv');
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');
    minutesSpan.innerHTML = '00';
    secondsSpan.innerHTML ='00';
}

//**************************************************************
// setScoreZero
// sets the score to zero before the game starts
//**************************************************************
function setScoreZero() {
  var score = document.getElementById('scorediv');  
  var currentSpan = score.querySelector('.current');
  var goalSpan = score.querySelector('.goal');

  currentSpan.innerHTML = '00';
  goalSpan.innerHTML = '00';
}

//**************************************************************
// updateScore
// updates score every time the user guests a word
//**************************************************************
function updateScore() {
  var score = document.getElementById('scorediv');  
  var currentSpan = score.querySelector('.current');
  counter ++;
  currentSpan.innerHTML = counter;
  ion.sound.play("door_bell", {
    volume: 0.2
  });
}

//**************************************************************
// displayModal
// open a modal when the user clicks the start button
//**************************************************************
function displayModal(params) {
  // Get the modal
  var modal = document.getElementById('myModal');
  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal 
  btn.onclick = function() {
      modal.style.display = "block";
  };
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      modal.style.display = "none";
  };
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  };
  // When the user clicks submit button, close it
  var submit = document.getElementById("submit");
  submit.onclick = function(event) {
       modal.style.display = "none";
  };
}

//**************************************************************
// renderTiles
// render the tiles of the board game
//**************************************************************
function renderTiles() {
  console.log("--------------------------------");
  console.log("RENDERING TILES!!!!!!!!!!!!!!!!!!!!!!!!!");
  var offset = 0;

  game.board.forEach(function(row, rowIndex){
    row.forEach(function (cell, cellIndex) {
      // if cell contains obstacles display them
      if (cell === 1) {
          var tileContainer = document.getElementById("tile-container");
          var newTile       = document.createElement("div");

          newTile.classList  = "tile";
          newTile.classList += " tile-position-" + rowIndex + "-" + cellIndex;
          // newTile.innerHTML  = (cell);
          // newTile.innerHTML  = ('<img src="images/fonts/svg/051-apricot.svg" style="width:50px;height:50px;">');
          newTile.innerHTML  = "";

          tileContainer.appendChild(newTile);        
      } 
      // if cells don't contain obstacles display letters with timeout
      else {
        setTimeout(function(){
          var tileContainer = document.getElementById("tile-container");
          var newTile       = document.createElement("div");

          newTile.classList  = "tile";
          newTile.classList += " tile-position-" + rowIndex + "-" + cellIndex;
          newTile.innerHTML  = (cell);

          tileContainer.appendChild(newTile);
        }, 1000 + offset);    
        offset += 1000;
      }
    });
  });
}

//**************************************************************
// resetTiles
// reset the tiles
//**************************************************************

function resetTiles () {
  // This method doesn’t return an array, it returns a NodeCollection element. 
  // We use the method Array.prototype.slice.call to transform this NodeCollection
  // into an Array, so we can use the foreach method to iterate over the elements.
  var tilesContainer = document.getElementById("tile-container");
  var tiles          = tilesContainer.getElementsByClassName("tile");
  
  Array.prototype.slice.call(tiles).forEach(function (tile) {
    tilesContainer.removeChild(tile);
  });
}

//**************************************************************
// getUserWord
// catches the word that the user enter 
//**************************************************************
function getUserWord() {
  $('#btn-insertWord').on("click", function(e){
    e.preventDefault();
    var userWord =  $("#insert-word").val();
    // clean the input after user enters letter
    $("#insert-word").val("");
    var userWordUpCase = userWord.toUpperCase();
    console.log(userWordUpCase);
    validWord = game._askWord(userWordUpCase);
    console.log(validWord);
    if (validWord) {
      updateScore();
      cleanLetters();
    }
    // if word is not valid play a sound
    else {
      ion.sound.play("light_bulb_breaking", {
        volume: 0.5
      });
    }    
  });
}

//**************************************************************
// cleanLetters
// clears all tiles
//**************************************************************
function cleanLetters () {
 game.board.forEach(function(row, rowIndex){
    row.forEach(function (cell, cellIndex) {
      if (!cell) {
        var tilesContainer = document.getElementById("tile-container");
        console.log('row: ' + rowIndex + '-' + 'cell: ' + cellIndex);
        var tiles          = tilesContainer.getElementsByClassName("tile-position-" + rowIndex + "-" + cellIndex);

        Array.prototype.slice.call(tiles).forEach(function (tile) {
          tilesContainer.removeChild(tile);
        });        
      }
    });
  });  
}

//**************************************************************
// startGame
// after click the button start
// set the name of the player and the level of the game
// trigger the timer
// start the game
//**************************************************************
function startGame(topic) {
  $('#submit').on("click", function(e){
    e.preventDefault();

    console.log(topic);
    game = new Scramble(topic);
    
    // get name value enter by user 
    var name =  $("#player-name-modal").val();
    // get which radio button was clicked so get the level
    var level = $( "input[type=radio][name=optradio]:checked" ).val();
    console.log(name);
    console.log(level);
    // set the name and level of the player in the screen
    $('#player-name label').html(name);
    $('#player-level label').html(level);

    // play sound when user enters name and level
    ion.sound.play("camera_flashing_2", {
      volume: 1.0
    });

    /*
     * the level of the game will be related with the timer countdown
     * level 1 : 6 minutes
     * level 2 : 4 minutes
     * level 3 : 2 minutes
     */
     var countDown = 0;
     switch (level) {
      case 'Level 1':
          countDown = 6;
        break;

      case 'Level 2':
          countDown = 4;
        break;  

      case 'Level 3':
          countDown = 2;
        break;   
    
      default:
        break;
    }

    // set the timer countdown from 5 minutes
    var deadline = new Date(Date.parse(new Date()) + countDown * 60 * 1000);
    initializeClock('clockdiv', deadline);

    // display tiles in the board
    renderTiles();
    
    // active the input to allow the user to enter a word
    $('input').prop('disabled', false);
    $('input').focus();

    // start displaying letter in the board
    game._displayLetter();
  });
}

//**************************************************************
// toggleGameOver
// displays a Game Over message when the timer reach zero or 
// when the user hit the goal
//**************************************************************

 function gameOver() {
    var gameOver = document.getElementById('game-over');
    gameOver.innerHTML = "Game Over!!" + "</br>" + 
                          "You scored: " + counter + " points </br>" +
                          "Press F5 to reset the game";
   // disable the input of words and display game over div
   $("#insert-word").prop('disabled', true);
   $("#game-over").toggleClass("hidden");

   // play sound when game is over
   ion.sound.play("game_over", {
     volume: 1.0
   });

   // set animation to the Game Over div
    $( "#game-over" ).animate({
        marginTop: "100px",
        width: "70%",
        fontSize: "3em",
        borderWidth: "10px"
    }, 1500 );
 }

//**************************************************************
// main application
//**************************************************************

// global variable to access to the game functions
// will be initialized every time that the “START” button is clicked.
var game;
var validWord = false;
var counter = 0;
var threeLettersEnglishWords = [
    'ace','bad','cat','day','egg','fan','gas','ham','ice','job',
    'key','law','man','nap','oak','pay','raw','sea','tea','use',
    'van','war','yes','zip','zoo','set','pie','mom'
    ];
var fourLettersEnglishWords = [
    'aqua','bozo','cozy','cuff','doze','exel','exam','foxy','gawk','huck',
    'ibex','jazz','knew','lazy','mozo','next','putz','quiz','vamp','whom',
    'zinc'
    ];
var topic = [];
var numberOfWords = 0;
/*
 * Initialize sounds to the aplication
 * Override individual configs by new ones each time you use a sound. 
 * In this case, override the default volume value by new one, 
 * each time a sound is played.
 */
ion.sound({
    sounds: [
        {name: "camera_flashing_2"},
        {name: "cd_tray"},
        {name: "light_bulb_breaking"},
        {name: "door_bell"},
        {name: "game_over"},
        {name: "button_tiny"}
    ],

    // main config
    path: "/sounds/",
    preload: true,
    multiplay: true,
    volume: 0.1 // default volume is 10%
});

$( document ).ready(function() {
  // get the topic to play from the menu
  $('.dropdown-menu').on("click", function(e) {
    console.log(e.target.innerHTML);

    switch (e.target.innerHTML) {
      case 'English Words with 3 Letters':
          topic = threeLettersEnglishWords;
          numberOfWords = topic.length;
        break;

      case 'English Words with 4 Letters':
          topic = fourLettersEnglishWords;
          numberOfWords = topic.length;
        break;  
    
      default:
        break;
    }

    var score = document.getElementById('scorediv');
    var goalSpan = score.querySelector('.goal');
    goalSpan.innerHTML = numberOfWords;
    console.log(numberOfWords);        
    displayModal();
    startGame(topic);
    getUserWord();
  });

  setScoreZero();
  setTimerZero();
  // disable the input of word till the game starts
  $("#insert-word").prop('disabled', true);
});
