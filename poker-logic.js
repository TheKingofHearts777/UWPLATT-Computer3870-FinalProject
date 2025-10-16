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
        "2":    2,
        "3":    3,
        "4":    4,
        "5":    5,
        "6":    6,
        "7":    7,
        "8":    8,
        "9":    9,
        "10":   10,
        "J":    11,
        "Q":    12,
        "K":    13,
        "A":    14
    };

    return valueMap[card.slice(0, -1)];
}

function getSuit(card) {
    return card.at(-1);
}

function sortCardsByRank(cards) {
    return cards.sort((a, b) => rankValue(a) - rankValue(b))
}

function getCombinations(cards) {
    const results = [];

    // Helper recursive function
    function helper(start, combo) {
        // Base case: if we’ve chosen 5 cards, store a copy
        if (combo.length === 5) {
            results.push([...combo]);
            return;
        }

        // Try adding each remaining card
        for (let i = start; i < cards.length; i++) {
            combo.push(cards[i]);
            helper(i + 1, combo);
            combo.pop(); // backtrack
        }
    }

    helper(0, []);
    return results;
}

function checkFlush(cards) {
    const suit = getSuit(cards[0]);

    for (let i = 1; i < cards.length; i++) {
        if (suit != getSuit(cards[i])) {
            return false;
        }
    }

    return true;
}

function checkStraight(cards) {
    // Handle Ace-low straight (A-2-3-4-5)
    const ranks = cards.map(c => rankValue(c));
    const aceLowRanks = ranks.map(r => r === 14 ? 1 : r).sort((a, b) => a - b);

    let isAceLowStraight = true;

    for (let i = 1; i < aceLowRanks.length; i++) {
        if (aceLowRanks[i] !== aceLowRanks[i - 1] + 1) {
            isAceLowStraight = false;
            break;
        }
    }

    if (isAceLowStraight) {
        return true;
    }

    // Ensure cards are in rank order
    // TODO: Handle Ace low which sorting does not allow for
    const sortedCards = sortCardsByRank(cards);

    let rank = rankValue(sortedCards[0]);

    for (let i = 1; i < sortedCards.length; i++) {
        // Does not account for ace low
        if (rankValue(sortedCards[i]) != rank + 1) {
            return false;
        }

        rank++;
    }

    return true;
}

function checkRoyalFlush(cards) {
    return checkFlush(cards) && (rankValue(sortCardsByRank(cards)[0]) == rankValue("10*") && checkStraight(cards));
}

function checkStraightFlush(cards) {
    return checkFlush(cards) && checkStraight(cards);
}

// TODO: Pass in result of findDuplicates(hand) to prevent calling it each for each function

function checkFourOfAKind(cards) {
    const rankCounts = findDuplicates(cards);
    
    // 4 of a kind will only have 1 set of duplicates as there is 1 card remaining
    return Object.keys(rankCounts).length == 1 && rankCounts[Object.keys(rankCounts)[0]] == 4;
}

function checkFullHouse(cards) {
    const rankCounts = findDuplicates(cards);

    // Full House will only 2 ranks
    return Object.keys(rankCounts).length == 2 && (
        (rankCounts[Object.keys(rankCounts)[0]] == 3 && rankCounts[Object.keys(rankCounts)[1]] == 2) ||
        (rankCounts[Object.keys(rankCounts)[0]] == 2 && rankCounts[Object.keys(rankCounts)[1]] == 3)
    );
}

function checkThreeOfAKind(cards) {
    const rankCounts = findDuplicates(cards);
    
    // Three of a kind will only have 1 rank in the duplicates as Full house contains a triple and pair
    return Object.keys(rankCounts).length == 1 && rankCounts[Object.keys(rankCounts)[0]] == 3;
}

function checkTwoPair(cards) {
    const rankCounts = findDuplicates(cards);

    // Two pair will only have 2 ranks in the duplicates as Four of a Kind contains 2 pairs of the same rank
    return Object.keys(rankCounts).length == 2 && rankCounts[Object.keys(rankCounts)[0]] == 2 &&
        rankCounts[Object.keys(rankCounts)[1]] == 2;
}

function checkOnePair(cards) {
    const rankCounts = findDuplicates(cards);

    // One Pair will only have 1 rank in the duplicates as Two pair contains 2 pairs
    return Object.keys(rankCounts).length == 1 && rankCounts[Object.keys(rankCounts)[0]] == 2;
}

/*
// Test cases for checkStraight
// Currently fails for Ace low
// Expected  Order: true, true, true, true, true, false, false, false, false
// Resulting Order: false, true, true, true, true, false, false, false, false
const hands = [
    // 5-high straight (Ace low)
    ["A♠", "2♦", "3♣", "4♥", "5♠"],
    
    // 6-high straight
    ["2♣", "3♠", "4♥", "5♦", "6♣"],
    
    // 9-high straight
    ["5♠", "6♦", "7♣", "8♥", "9♦"],
    
    // Queen-high straight
    ["8♣", "9♠", "10♦", "J♥", "Q♣"],
    
    // Ace-high straight (Broadway)
    ["10♠", "J♦", "Q♥", "K♣", "A♣"],
    
    // Gap in sequence (missing 8)
    ["5♣", "6♦", "7♠", "9♥", "10♣"],
    
    // Duplicate rank breaks sequence
    ["6♣", "6♦", "7♠", "8♥", "9♣"],
    
    // Not consecutive (mixed gaps)
    ["3♣", "5♦", "6♠", "9♥", "J♣"],
    
    // All face cards but missing 10 (no straight)
    ["J♣", "Q♦", "K♠", "A♥", "A♣"]
];

for (hand of hands) {
    console.log(checkStraight(hand));
}
*/

function findDuplicates(cards) {
    const sortedCards = sortCardsByRank(cards);

    let rankCount = {};

    for (let i = 0; i < sortedCards.length; i++) {
        const rank = rankValue(sortedCards[i]);

        if (rankCount[rank]) {
            rankCount[rank]++;
        } else {
            rankCount[rank] = 1;
        }
    }

    const duplicates = Object.fromEntries(
        Object.entries(rankCount).filter(([rank, count]) => count > 1)
    );

    // console.log(duplicates);

    return duplicates;
}

function findHand(cards) {
    const allHands = getCombinations(cards);

    for (const hand of allHands) {

    }
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