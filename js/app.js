// A list of all available Cards, game chooses 8 from this list randomly

let availableCards = [
  "leaf",
  "anchor",
  "cube",
  "gamepad",
  "headphones",
  "glass",
  "bomb",
  "bolt",
  "futbol-o",
  "binoculars"
];

let flipped = []; // flipped cards
let moves = 0;
let stars = 0;
let cardList = [];
let match = 0;
let numOfCards = 8; // This can be modified later to make the game harder
let now;
let timeDiff;
let leastMoves = 999;
let leastSeconds = 999;
let startTime;
let seconds = 0;
let isGameStarted = false;
let timer;

/**
 * @description Initializes the game
 * @constructor
 *
 */
function init() {
  availableCards = [
    "leaf",
    "anchor",
    "cube",
    "gamepad",
    "headphones",
    "glass",
    "bomb",
    "bolt",
    "futbol-o",
    "binoculars"
  ];

  $(".deck").empty(); // Delete previous game
  cardList = []; // delete previous stack of cards
  layCards();

  $(".moves").text("0");
  match = 0;
  moves = 0;
  seconds = 0;
  $(".seconds").text(seconds);

  $(".stars i")
    .removeClass("fa-star-o")
    .addClass("fa-star"); // Add 3 stars
  stars = 3;

  $(".card").on("click", flipCard);
  isGameStarted = false;

  clearTimeout(timer);
}

/**
 * @description randomly take some icons from the list and add it to the stack
 * @constructor
 *
 */
function layCards() {
  for (let i = 0; i < numOfCards; i++) {
    let randomCard = availableCards.splice(
      (availableCards.length * Math.random()) | 0,
      1
    )[0];
    cardList.push(randomCard); // push twice as we need pairs
    cardList.push(randomCard);
  }
  cardList = shuffle(cardList);

  for (let card of cardList) {
    $(".deck").append(
      `<li class="card animated"><i class="fa fa-${card}"></i></li>`
    );
  }
}

/**
 * @description Shuffle function from http://stackoverflow.com/a/2450976
 * @constructor
 * @param {array} cards - stack of cards
 * @returns {array} cards - shuffled stack of cards
 */
function shuffle(cards) {
  let currentIndex = cards.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }

  return cards;
}

/**
 * @description flips card
 * @constructor
 */
function flipCard() {
  if (!isGameStarted) {
    startTime = new Date();
    refreshSeconds();
    isGameStarted = true;
  }

  if (flipped.length === 0) {
    $(this).addClass("show open");
    flipped.push($(this));
    unClickable();
  } else if (flipped.length === 1) {
    // refresh moves
    refreshMoves();
    $(this).toggleClass("show open");
    flipped.push($(this));
    setTimeout(checkMatch, 500);
  }
}

/**
 * @description check openCards if they match or not
 * @constructor
 */
function checkMatch() {
  if (
    flipped[0][0].firstChild.className == flipped[1][0].firstChild.className
  ) {
    flipped[0].addClass("match pulse"); //.animateCss('pulse');
    flipped[1].addClass("match pulse"); //.animateCss('pulse');
    unClickable();
    flipped = []; // turn over the flipped cards
    setTimeout(checkWin, 700); // wait for 1.4 secs to check if win
  } else {
    flipped[0].toggleClass("show open");
    flipped[1].toggleClass("show open");
    enableClick();
    flipped = []; // turn over the flipped cards
  }
}

/**
 * @description refreshes seconds every second
 * @constructor
 */
function refreshSeconds() {
  now = new Date();
  timeDiff = now - startTime;
  seconds = Math.floor(timeDiff / 1000);

  $(".seconds").text(seconds);
  timer = setTimeout(refreshSeconds, 1000);
}

/**
 * @description makes card unclickable so that a user cannot pick the same card twice
 * @constructor
 */
function unClickable() {
  for (let card of flipped) {
    card.off("click");
  }
}

/**
 * @description make it clickable
 * @constructor
 */
function enableClick() {
  flipped[0].on("click", flipCard);
}

/**
 * @description refresh the number of moves and show it in the scoreboard
 * @constructor
 */
function refreshMoves() {
  moves += 1;
  $(".moves").html(`${moves} `);
  refreshStars();
}

/**
 * @description check whether the game is finished or not
 * @constructor
 */
function checkWin() {
  match += 1;
  if (match == numOfCards) {
    endGame();
  }
}

/**
 * @description refreshes the stars shown in the game
 *  moves less than 2 times number of cards 3 stars
 *  moves less than 2 times number of cards plus 5 is 2 stars
 * @constructor
 */
function refreshStars() {
  if (moves === 2 * numOfCards) {
    $(".stars")
      .children()
      .eq(2)
      .children()
      .removeClass("fa-star")
      .addClass("fa-star-o"); // 2star
    stars -= 1;
  }

  if (moves == (2 * numOfCards) + 5) {
    $(".stars")
      .children()
      .eq(1)
      .children()
      .removeClass("fa-star")
      .addClass("fa-star-o"); // 1 star
    stars -= 1;
  }
}

/**
 * @description End Game -- sweet alerts is used
 * @constructor
 */
function endGame() {
  clearTimeout(timer);
  leaderboard();
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: "Congratulations!",
    text:
      moves +
      " Moves " +
      stars +
      " Stars " +
      seconds +
      " Seconds." +
      "\n Leaderboard: \n" +
      "Least Moves: " +
      leastMoves +
      " moves \n" +
      "Least Time: " +
      leastSeconds +
      " seconds \n",
    type: "success",
    confirmButtonText: "Play again!"
  }).then(function(isConfirm) {
    if (isConfirm) {
      init();
    }
  });
}

// Restart Game -- sweet alerts is used
$(".restart").on("click", function() {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: "Are you sure?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Restart Game!"
  }).then(function(isConfirm) {
    if (isConfirm) {
      init();
    }
  });
});

/**
 * @description Updates the leaderboard for now there is no hard drive storage
 * so the scores are reset once the game is refreshed
 * @constructor
 */
function leaderboard() {
  if (moves < leastMoves) {
    leastMoves = moves;
  }
  if (seconds < leastSeconds) {
    leastSeconds = seconds;
  }
}

init();
