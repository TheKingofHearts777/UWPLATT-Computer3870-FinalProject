// === Pause/Resume ===

const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const pauseOverlay = document.getElementById('pause-overlay');
const gameArea = document.getElementById('game-area');

function pauseGame() {
    gameArea.style.filter = 'blur(5px)';
    pauseOverlay.style.display = 'flex';
}
function resumeGame() {
    gameArea.style.filter = 'none';
    pauseOverlay.style.display = 'none';
}
pauseBtn.addEventListener('click', pauseGame);
resumeBtn.addEventListener('click', resumeGame);
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        (pauseOverlay.style.display === "flex") ? resumeGame() : pauseGame();
    }
});


// === Poker Logic ===

const nextPhaseBtn = document.getElementById('nextBtn');
const foldBtn = document.getElementById('foldBtn');
const gameBoard = document.getElementById('board');
const gameStatus = document.getElementById('status');

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
let deck = [], player = [], computer = [], board = [], phase = 0;

function makeDeck() {
    // Create a new deck with all combinations of ranks and suits
    deck = [];
    for (let suit of SUITS) {
        for (let rank of RANKS) {
            deck.push(rank + suit);
        }
    }

    // Shuffle the deck using Fisher-Yates algorithm
    for (let i = deck.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[randomIndex]] = [deck[randomIndex], deck[i]];
    }
}

function dealCard(to) { to.push(deck.pop()); }
function burn() { deck.pop(); }

function renderCards(elemId, cards, hidden = false) {
    nextPhaseBtn.textContent = "Next Phase";
    if (phase === 4) {
        nextPhaseBtn.textContent = "Deal Again";
        foldBtn.style.display = "none";
    }
    else {
        foldBtn.style.display = "inline-block";
    }
    const div = document.getElementById(elemId);
    div.innerHTML = "";
    for (let c of cards) {
        const d = document.createElement("div");
        d.className = "card";
        if (hidden) {
            const img = document.createElement("img");
            img.src = "assets/card-back.jpg";
            img.alt = "Card_back";
            img.style.fontSize = "10px";
            img.style.width = "100%";
            img.style.height = "100%";
            d.appendChild(img);
        } else {
            if (c.endsWith("♥") || c.endsWith("♦")) d.style.color = "red";
            d.textContent = c;
        }
        div.appendChild(d);
    }
}

function deal() {
    makeDeck();
    player = []; computer = []; board = []; phase = 0;
    for (let i = 0; i < 2; i++) { dealCard(player); dealCard(computer); }
    document.getElementById("status").textContent = "Pre-Flop";
    renderCards("playerHand", player);
    renderCards("computerHand", computer, true);
    gameBoard.innerHTML = "";
}

function fold() {
    gameStatus.textContent = "You folded. Computer wins!";
    phase = 4;
    renderCards("computerHand", computer, false);
    nextPhaseBtn.textContent = "Deal Again";
}

function nextPhase() {
    if (phase === 0) { burn(); dealCard(board); dealCard(board); dealCard(board); phase = 1; gameStatus.textContent = "Flop"; }
    else if (phase === 1) { burn(); dealCard(board); phase = 2; gameStatus.textContent = "Turn"; }
    else if (phase === 2) { burn(); dealCard(board); phase = 3; gameStatus.textContent = "River"; }
    else if (phase === 3) {
        renderCards("computerHand", computer, false);
        gameStatus.textContent = "Showdown: " + compareHands();
        phase = 4;
    } else { deal(); }
    renderCards("board", board);
}

function rankValue(card) {
    const valueMap = {
        "2":    0,
        "3":    1,
        "4":    2,
        "5":    3,
        "6":    4,
        "7":    5,
        "8":    6,
        "9":    7,
        "10":   8,
        "J":    9,
        "Q":    10,
        "K":    11,
        "A":    12
    };

    return valueMap[card.slice(0, -1)];
}

function sortCardsByRank(cards) {
    return cards.sort((a, b) => rankValue(a) - rankValue(b))
}

function highCard(cards) {
    return Math.max(...cards.map(c => rankValue(c)));
}

function compareHands() {
    const playerAll = [...player, ...board];
    const computerAll = [...computer, ...board];
    const p = highCard(playerAll);
    const c = highCard(computerAll);
    if (p > c) return "You win!";
    if (p < c) return "Computer wins!";
    return "It's a tie!";
}

deal();
nextPhaseBtn.addEventListener("click", nextPhase);
foldBtn.addEventListener("click", fold);