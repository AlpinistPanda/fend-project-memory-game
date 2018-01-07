
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

let startTime
let seconds = 0
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 // Initializes

 function init() {
   $('.deck').empty();  // Delete previous game
   cardList = [];   // delete previous stack of cards
   layCards();
   $('.card').on('click', flipCard);
   startTime = new Date();


   $('.moves').text('0');
   match = 0;
   moves = 0;
   seconds = 0;

   $('i').removeClass('fa-star-o').addClass('fa-star');  // Add 3 stars
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


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 // card functionality
 function flipCard() {
   refreshSeconds();


   if (flipped.length === 0) {
     $(this).addClass("show open");
     // $(this).toggleClass("show open");//.animateCss('flipInY');
     flipped.push($(this));
     unClickable();
   }

   else if (flipped.length === 1) {
     // refresh moves
     refreshMoves();
     $(this).toggleClass("show open");//.animateCss('flipInY');
     flipped.push($(this));
     setTimeout(checkMatch, 500);
   }
 }

 // check openCards if they match or not
function checkMatch() {
    if (flipped[0][0].firstChild.className == flipped[1][0].firstChild.className) {
        flipped[0].addClass("match");//.animateCss('pulse');
        flipped[1].addClass("match");//.animateCss('pulse');
        unClickable();
        flipped = [] // turn over the flipped cards
        setTimeout(checkWin, 700);   // wait for 1.4 secs to check if win
    }
    else {
      flipped[0].toggleClass("show open");//.animateCss('flipInY');
      flipped[1].toggleClass("show open");//.animateCss('flipInY');
      enableClick();
      flipped = []   // turn over the flipped cards
    }
}

function refreshSeconds(){
  now = new Date();
  timeDiff = now - startTime;
  seconds = Math.floor(timeDiff/1000);

  $('.seconds').text(seconds);
  setTimeout(refreshSeconds, 1000);
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
    $('i').eq(2).removeClass('fa-star').addClass('fa-star-o');  // 2star
    stars -= 1;
  }

  if (moves == 3 * numOfCards) {
    $('i').eq(1).removeClass('fa-star').addClass('fa-star-o');  // 1 star
    stars -= 1;
  }

  if (moves == 4 * numOfCards) {
    $('i').eq(0).removeClass('fa-star').addClass('fa-star-o');  // 1 star
    stars -= 1;
  }

}

// End Game -- sweet alerts is used
function endGame() {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Congratulations!',
		text:  moves + ' Moves '+ stars + ' Stars ' + seconds + ' Seconds.',
		type: 'success',
		confirmButtonText: 'Play again!'
	}).then(function(isConfirm) {
		if (isConfirm) {
			init();
		}
	})
}

// Restart Game
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




 init();
 // setTimeout(refreshSeconds, 1000);
