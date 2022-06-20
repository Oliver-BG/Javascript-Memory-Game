'use strict';
import Timer from "./timer.js";

/* ----------------- VARIABLE DECLARATION ----------------- */

new Timer(
  document.querySelector('.timer-container')
)

// QUERY SELECTION VARIABLES FOR HTML ELEMENT CLASSES
const container = document.querySelector('.container');
const moveContainer = document.getElementById('moves');
const maxMoves = document.getElementById('max-moves');

// MAIN MODAL
const mainModal = document.querySelector('.main-modal');
const btnPlay = document.getElementById('btn-play');
const btnAbout = document.getElementById('btn-abt');
const btnInstr = document.getElementById('btn-instr');

// DIFFICULTY MODAL
const diffMenu = document.querySelector('.diff-modal');
const btnVEasy = document.getElementById('btn-veasy');
const btnEasy = document.getElementById('btn-easy');
const btnMedium = document.getElementById('btn-med');
const btnHard = document.getElementById('btn-hard');
const btnVHard = document.getElementById('btn-vhard');
const btnBack = document.getElementById('btn-back');


// WIN/LOSE MODAL BUTTONS
const winModal = document.querySelector('.win-modal');
const loseModal = document.querySelector('.lose-modal');
const btnYes = document.querySelectorAll('.btn-yes');
const btnNo = document.querySelectorAll('.btn-no');

// PAUSE MODAL BUTTONS
const pauseModal = document.querySelector('.pause-modal');
const btnPause = document.getElementById('btn-pause');
const btnCont = document.getElementById('btn-cont');
const btnBackP = document.getElementById('btn-back-p');
const btnInstrP = document.getElementById('btn-instr-p');

// ABOUT MODAL
const aboutModal = document.querySelector('.about-modal');
const btnBackAbt = document.getElementById('btn-abt-back');

// INSTRUCTION MODAL
const instrModal = document.querySelector('.instr-modal');
const instrModalP2 = document.querySelector('.instr-modal-p2');
const instrModalP3 = document.querySelector('.instr-modal-p3');
const instrModalP4 = document.querySelector('.instr-modal-p4');
const instrModalP5 = document.querySelector('.instr-modal-p5');
const btnBackInstr = document.querySelectorAll('.btn-instr-back');
const btnPrevInstr = document.querySelectorAll('.prev');
const btnNextInstr = document.querySelectorAll('.next');

const instruct = [instrModal, instrModalP2, instrModalP3, instrModalP4, instrModalP5];

instruct.forEach(instructmod => instructmod.style.visibility = 'hidden');

// VARIABLES
let moves = 0;
let flag = true;
let attempts;
let firstPick;
let firstPickEl;
let secondPick;
let secondPickEl;
let correct;
let diffVar;
let playing = false;

// ARRAY VARIABLES
let cards = [
  'symbol--0.png',
  'symbol--1.png',
  'symbol--2.png',
  'symbol--3.png',
  'symbol--4.png',
  'symbol--5.png',
  'symbol--6.png',
  'symbol--7.png',
  'symbol--8.png',
  'symbol--9.png',
  'symbol--10.png',
  'symbol--11.png',
  'symbol--12.png',
  'symbol--13.png',
  'symbol--14.png',
  'symbol--15.png'
];

let shuffled = [];

/* ----------------- FUNCTION DECLARATION ----------------- */

const randomNum = function (length) {
  // Returns a random number from zero to the given argument value.
  let RNG = Math.floor(Math.random() * length);
  return RNG;
};

const appendCards = function (num) {
  // Pushes the card in another array, with twice the item.
  for (let i = 0; num > i; i++) {
    for (let j = 0; 2 > j; j++) {
      shuffled.push(cards[i]);
    }
  }
};

const shuffleCards = function () {
  // Shuffles the cards/array in a random order using Fisher-Yates shuffling algorithm.
  for (let i = shuffled.length - 1; i >= 1; i--) {
    let randIndex = randomNum(i);
    let temp1 = shuffled[randIndex];
    let temp2 = shuffled[i];
    shuffled[i] = temp1;
    shuffled[randIndex] = temp2;
  }
};

const createCard = function (symbols) {
  // Dynamically creates a card for the game.
  const card = document.createElement('div');
  const cardAttr = {
    value: `${symbols}`,
    draggable: 'false',
    onmousedown: 'return false',
    style: 'user-drag: none',
  };

  card.classList.add('card');
  Object.keys(cardAttr).forEach(key => {
    card.setAttribute(key, cardAttr[key]);
  });
  card.innerHTML += `<img class = "img" src = ./cardback.png height = 75px value = ${symbols} alt= ${symbols}>`;

  container.appendChild(card);
};

const haveCards = function () {
  // Shuffles the cards in a random order.
  for (let card of shuffled) {
    createCard(card);
  }
};

const wrongPick = function (el, timeOut) {
  // Executes when the choices don't match.
  el.style.transform = 'rotateY(0deg) perspective(600px)';
  firstPickEl.style.transform = 'rotateY(0deg) perspective(600px)';
  firstPickEl.addEventListener('click', matchCard);
  el.addEventListener('click', matchCard);
  enableEvent();
  clearTimeout(timeOut);
};

const correctPick = function () {
  // Remove the value of the card from the shuffled array.
  correct = secondPickEl.getAttribute('value');
  for (let i = 0; shuffled.length > i; i++) {
    if (correct === shuffled[i]) {
      shuffled.splice(i, 1);
      // Decrements so that the array will match the current index number in relation to its current length.
      i--;
    }
  }
};

const disableEvent = function () {
  // Disables clicking event when the two cards are revealed for a while.
  const cardsContainer = document.querySelectorAll('.card');
  for (let card of cardsContainer) {
    card.removeEventListener('click', matchCard);
  }

  const images = document.querySelectorAll('.img');
  for (let i = 0; images.length > i; i++) {
    images[i].removeEventListener('click', flipCard);
  }
};

const winGame = function () {
  // Executes when the player wins.
  if (shuffled.length === 0) {
    blur();
    winModal.style.visibility = 'visible';
    btnPause.style.visibility = 'hidden';
  }
};

const loseGame = function () {
  // Displays the lose modal and reveals the cards.
  btnPause.style.visibility = 'hidden';
  loseModal.style.visibility = 'visible';
};

const hideCard = function () {
  // Hides the card if the card is still in the shuffled array.
  const images = document.querySelectorAll('.img');
  for (let image of images) {
    if (shuffled.includes(image.getAttribute('src'))) {
      setTimeout(()=> image.src = 'cardback.png', 150);
    }
  }
};

const enableEvent = function () {
  // Brings the revealed cards hidden if the player failed to guess the correct match
  const cardsContainer = document.querySelectorAll('.card');
  const images = document.querySelectorAll('.img');

  hideCard();

  // Brings back the event listener after revealing the cards
  cardsContainer.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', matchCard);
  });

  images.forEach(image => image.addEventListener('click', flipCard));
};

const matchCard = function () {
  // Handles the games logic.
  showMoves();
  this.style.transform = 'rotateY(180deg) perspective(600px)';

  if (flag) {
    firstPick = this.getAttribute('value');
    firstPickEl = this;
    this.removeEventListener('click', matchCard);
    flag = !flag;
  } else if (!flag) {
    secondPick = this.getAttribute('value');
    secondPickEl = this;
    this.removeEventListener('click', matchCard);
    flag = !flag;
    moves += 1;
    if (firstPick === secondPick) {
      showMoves();
      correctPick();
      winGame();
    } else if (moves >= attempts) {
      // Checks if the attempts are equal to the moves made.
      disableEvent();
      blur();
      loseGame();
    } else {
      // Increments the move value and checks if exceeded the attempt limit.
      disableEvent();
      showMoves();
      const timeOut = setTimeout(() => {
        wrongPick(this, timeOut);
      }, 500);
    }
  }
};

const flipCard = function () {
  // Flips the card.
  setTimeout(() => this.src = this.getAttribute('value'), 150);
};


/* ----------------- MAIN FUNCTION ----------------- */

const mainGame = function (diffVar) {
  // Executes the mechanics of the game.
  btnPause.style.visibility = 'visible';
  diffMenu.style.visibility = 'hidden';
  maxMoves.innerHTML = `<a> &nbsp &nbsp MAX. ATTEMPTS: ${attempts} </a>`;
  appendCards(diffVar);
  shuffleCards();
  haveCards();
  const cardsContainer = document.querySelectorAll('.card');
  flipActive();

  const images = document.querySelectorAll('.img');

  cardsContainer.forEach(card => card.addEventListener('click', matchCard));

  images.forEach(image => image.addEventListener('click', flipCard));
};

const showMoves = function () {
  // Shows the number of moves the player has done.
  moveContainer.innerHTML = `<a> &nbsp &nbsp MOVES: ${moves} </a>`;
};

const backButtonEvent = function () {
  // Goes back to the main menu
  diffMenu.style.visibility = 'hidden';
  pauseModal.style.visibility = 'hidden';
  mainModal.style.visibility = 'visible';
  moveContainer.innerHTML = `<a> &nbsp &nbsp MOVES: 0 </a>`;
  maxMoves.innerHTML = `<a> &nbsp &nbsp MAX. ATTEMPTS: 0 </a>`;
  playing = false;
};

const blur = function () {
  const cards = document.querySelectorAll('.card');
  const images = document.querySelectorAll('.img');
  cards.forEach(card => card.classList.toggle('blur'));
  cards.forEach(card => (card.style.cursor = 'default'));
  images.forEach(img => img.classList.remove('active'));
};

const btnPauseEvent = function () {
  // Pauses the game and loads the pause modal.
  disableEvent();
  blur();
  btnPause.removeEventListener('click', btnPauseEvent);
  pauseModal.style.visibility = 'visible';
};

const restartGame = function () {
  // Restarts the game after winning or losing it.
  const cardsContainer = document.querySelectorAll('.card');
  for (let card of cardsContainer) {
    card.remove();
  }
  shuffled = [];
  moves = 0;
  flag = true;
};

const flipActive = function () {
  const images = document.querySelectorAll('.img');
  for (let image of images) {
    image.classList.add('.active');
  }
};

/* ----------------- EVENT LISTENERS ----------------- */

/* DIFFICULTY MODAL */

btnVEasy.addEventListener('click', () => {
  // Draws eight(8) cards when the player selects easy mode.
  diffVar = btnVEasy.getAttribute('value');
  attempts = 12;
  container.style.gridTemplateColumns = '25% 25% 25% 25%';
  container.style.gridTemplateRows = '40% 40%';
  playing = true;
  mainGame(diffVar);
});

btnEasy.addEventListener('click', () => {
  // Draws ten(10) cards when the player selects easy mode.
  diffVar = btnEasy.getAttribute('value');
  attempts = 14;
  container.style.gridTemplateColumns = '20% 20% 20% 20% 20%';
  container.style.gridTemplateRows = '40% 40%';
  playing = true;
  mainGame(diffVar);
});

btnMedium.addEventListener('click', () => {
  // Draws sixteen(16) cards when the player selects medium mode.
  diffVar = btnMedium.getAttribute('value');
  attempts = 24;
  container.style.gridTemplateColumns = '25% 25% 25% 25%';
  container.style.gridTemplateRows = '35% 35% 35% 35%';
  playing = true;
  mainGame(diffVar);
});

btnHard.addEventListener('click', () => {
  // Draws twenty four(24) cards when the player selects hard mode.
  diffVar = btnHard.getAttribute('value');
  attempts = 32;
  container.style.gridTemplateColumns = '16% 16% 16% 16% 16% 16%';
  container.style.gridTemplateRows = '35% 35% 35% 35%';
  playing = true;
  mainGame(diffVar);
});

btnVHard.addEventListener('click', () => {
  // Draws twenty four(24) cards when the player selects hard mode.
  diffVar = btnVHard.getAttribute('value');
  attempts = 40;
  container.style.gridTemplateColumns = '12% 12% 12% 12% 12% 12% 12% 12%';
  container.style.gridTemplateRows = '35% 35% 35% 35%';
  playing = true;
  mainGame(diffVar);
});

/* WIN/LOSE MODAL */

btnYes.forEach(yes =>
  yes.addEventListener('click', () => {
    // Restarts the game by loading the difficulty modal.
    restartGame();
    blur();
    winModal.style.visibility = 'hidden';
    loseModal.style.visibility = 'hidden';
    diffMenu.style.visibility = 'visible';
  })
);

btnNo.forEach(no =>
  no.addEventListener('click', () => {
    // Restarts the game by loading the difficulty modal.
    restartGame();
    blur();
    winModal.style.visibility = 'hidden';
    loseModal.style.visibility = 'hidden';
    mainModal.style.visibility = 'visible';
    playing = false;
  })
);

/* MAIN MENU MODAL */

btnPlay.addEventListener('click', () => {
  // Loads the difficulty modal and hides the main modal.
  mainModal.style.visibility = 'hidden';
  diffMenu.style.visibility = 'visible';
});

btnBack.addEventListener('click', backButtonEvent);

/* PAUSE MODAL */

btnPause.addEventListener('click', btnPauseEvent);

btnCont.addEventListener('click', () => {
  // Continues the game and hides the pause modal.
  enableEvent();
  blur();
  btnPause.addEventListener('click', btnPauseEvent);
  pauseModal.style.visibility = 'hidden';
});

btnBackP.addEventListener('click', () => {
  // Removes all the cards and loads back to the main modal.
  backButtonEvent();
  restartGame();
  playing = false;
  btnPause.style.visibility = 'hidden';
  btnPause.addEventListener('click', btnPauseEvent);
});

btnInstrP.addEventListener('click', () => {
  pauseModal.style.visibility = 'hidden';
  instrModal.style.visibility = 'visible';
})

/* INSTRUCTION MODAL */

btnBackInstr.forEach(btn => btn.addEventListener('click', () => {
  instruct.forEach(instructmod => instructmod.style.visibility = 'hidden');
  if(!playing){
    mainModal.style.visibility = 'visible';
  } else {
    pauseModal.style.visibility = 'visible';
  }
}));

btnInstr.addEventListener('click', () => {
  instrModal.style.visibility = 'visible';
  mainModal.style.visibility = 'hidden';
});

/* INSTRUCTION MODAL NEXT BUTTON */

btnNextInstr.forEach((next, i) => next.addEventListener('click', ()=> {
  if(instruct.at(-1).style.visibility === 'hidden'){
    instruct[i].style.visibility = 'hidden';
    instruct[i + 1].style.visibility = 'visible';
  }
}));

btnPrevInstr.forEach((prev, i) => prev.addEventListener('click', ()=> {
  if(instruct[0].style.visibility === 'hidden'){
    instruct[i].style.visibility = 'hidden';
    instruct[i - 1].style.visibility = 'visible';
  }
}));

/* ABOUT MODAL */
btnAbout.addEventListener('click', () => {
  mainModal.style.visibility = 'hidden';
  aboutModal.style.visibility = 'visible';
})

btnBackAbt.addEventListener('click', () => {
  backButtonEvent();
  aboutModal.style.visibility = 'hidden';
});



