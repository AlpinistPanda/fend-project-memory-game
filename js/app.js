// A list of all available Cards, game chooses 8 from this list randomly

let availableCards = ['leaf', 'anchor', 'cube', 'gamepad', 'headphones', 'glass', 'bomb',
                      'bolt', 'futbol-o', 'binoculars'];


let flipped = [];   // flipped cards
let moves = 0;
let stars = 0;
let cardList = [];
let match = 0
let numOfCards = 8   // This can be modified later to make the game harder
let now
let timeDiff
let leastMoves = 999
let leastSeconds = 999
let startTime
let seconds = 0
let isWon = false;
let isGameStarted = false;

 // Initializes

 function init() {

     availableCards = ['leaf', 'anchor', 'cube', 'gamepad', 'headphones', 'glass', 'bomb',
                           'bolt', 'futbol-o', 'binoculars'];

   $('.deck').empty();  // Delete previous game
   cardList = [];   // delete previous stack of cards
   layCards();
   $('.card').on('click', flipCard);
   isWon = false;
   isGameStarted = false;

   $('.moves').text('0');
   match = 0;
   moves = 0;
   seconds = 0;
   $('.seconds').text(seconds);

   $('.stars').removeClass('fa-star-o').addClass('fa-star');  // Add 3 stars
   stars = 3;
 };

 // randomly take some icons from the list and add it to the stack

function layCards() {
  for (let i = 0; i < numOfCards; i++) {
    let randomCard = availableCards.splice(availableCards.length * Math.random() | 0, 1)[0];
    cardList.push(randomCard);    // push twice as we need pairs
    cardList.push(randomCard);
  }
  cardList = shuffle(cardList);

  for (let card of cardList){
    $('.deck').append(`<li class="card animated"><i class="fa fa-${card}"></i></li>`);
  }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


 // flips the card
 function flipCard() {
   if(moves === 0 && isGameStarted === false){  // starts the timer
     isGameStarted = true;
     startTime = new Date();
   }
   refreshSeconds();


   if (flipped.length === 0) {
     $(this).addClass("show open");
     flipped.push($(this));
     unClickable();
   }

   else if (flipped.length === 1) {
     // refresh moves
     refreshMoves();
     $(this).toggleClass("show open");
     flipped.push($(this));
     setTimeout(checkMatch, 500);
   }
 }

 // check openCards if they match or not
function checkMatch() {
    if (flipped[0][0].firstChild.className == flipped[1][0].firstChild.className) {
        flipped[0].addClass("match pulse");//.animateCss('pulse');
        flipped[1].addClass("match pulse");//.animateCss('pulse');
        unClickable();
        flipped = [] // turn over the flipped cards
        setTimeout(checkWin, 700);   // wait for 1.4 secs to check if win
    }
    else {
      flipped[0].toggleClass("show open");
      flipped[1].toggleClass("show open");
      enableClick();
      flipped = []   // turn over the flipped cards
    }
}

function refreshSeconds(){
  if(!isWon){
    now = new Date();
    timeDiff = now - startTime;
    seconds = Math.floor(timeDiff/1000);

    $('.seconds').text(seconds);
    setTimeout(refreshSeconds, 1000);
  }

}

// Make it unclickable
function unClickable() {
  for (let card of flipped){
        card.off('click');
    }
}

// make it clickable
function enableClick() {
    flipped[0].on('click', flipCard);
}

// refresh the number of moves and show it in the scoreboard
function refreshMoves() {
    moves += 1;
    $('.moves').html(`${moves} `);
    refreshStars();
}

// check whether the game is finished or not
function checkWin() {
    match += 1;
    if (match == numOfCards) {
        endGame();
    }
}

// refreshes the stars shown in the game
// moves less than 2 times number of cards 3 stars
// moves less than 3 times number of cards 2 stars
// moves less than 4 times number of cards 1 star
function refreshStars(){

  if (moves == 2 * numOfCards) {
    $('.stars').eq(2).removeClass('fa-star').addClass('fa-star-o');  // 2star
    stars -= 1;
  }

  if (moves == 3 * numOfCards) {
    $('.stars').eq(1).removeClass('fa-star').addClass('fa-star-o');  // 1 star
    stars -= 1;
  }

}

// End Game -- sweet alerts is used
function endGame() {
  isWon = true;
  leaderboard();
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Congratulations!',
		text:  moves + ' Moves '+ stars + ' Stars ' + seconds + ' Seconds.'
          + '\n Leaderboard: \n' + 'Least Moves: ' + leastMoves + ' moves \n'
          + 'Least Time: ' + leastSeconds + ' seconds \n',
		type: 'success',
		confirmButtonText: 'Play again!'
	}).then(function(isConfirm) {
		if (isConfirm) {
			init();
		}
	})
}

// Restart Game -- sweet alerts is used
$('.restart').on('click', function() {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Are you sure?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Restart Game!'
  }).then(function(isConfirm) {
    if (isConfirm) {
      init();
    }
  })
});

// Updates the leaderboard for now there is no hard drive storage
// so the scores are reset once the game is refreshed
function leaderboard(){
  if(moves<leastMoves){
    leastMoves = moves;
  }
  if(seconds<leastSeconds){
    leastSeconds = seconds;
  }
}

 init();
