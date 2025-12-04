import { Player } from "./Player.js";

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

function makeDeck(state) {
    let deck = [];

    // Create a new deck with all combinations of ranks and suits
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

    state.deck = deck;
}

function dealCard(state, toHand) {
    toHand.push(state.deck.pop());
}

function burn(state) {
    state.deck.pop();
}

function rankValue(card) {
    const valueMap = {
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
        "10": 10,
        "J": 11,
        "Q": 12,
        "K": 13,
        "A": 14
    };

    try {
        return valueMap[card.slice(0, -1)];
    } catch (e) {
        console.error("exception: ", e);
        console.log("card: ", card);
    }
}

function getSuit(card) {
    return card.at(-1);
}

// Sort cards by rank in ascending order
function sortCardsByRank(cards) {
    return cards.sort((a, b) => rankValue(a) - rankValue(b));
}

// Represents a 5-card hand
class PokerHand {
    constructor(cards) {
        this.cards = cards;
        this.duplicateRanks = findDuplicates(cards);

        this.handRank = this.evaluate();
    }

    evaluate() {
        if (checkRoyalFlush(this.cards)) {
            this.handRank = HandRank.ROYAL_FLUSH;
        } else if (checkStraightFlush(this.cards)) {
            this.handRank = HandRank.STRAIGHT_FLUSH;
        } else if (checkFourOfAKind(this.cards)) {
            this.handRank = HandRank.FOUR_OF_A_KIND;
        } else if (checkFullHouse(this.cards)) {
            this.handRank = HandRank.FULL_HOUSE;
        } else if (checkFlush(this.cards)) {
            this.handRank = HandRank.FLUSH;
        } else if (checkStraight(this.cards)) {
            this.handRank = HandRank.STRAIGHT;
        } else if (checkThreeOfAKind(this.cards)) {
            this.handRank = HandRank.THREE_OF_A_KIND;
        } else if (checkTwoPair(this.cards)) {
            this.handRank = HandRank.TWO_PAIR;
        } else if (checkOnePair(this.cards)) {
            this.handRank = HandRank.ONE_PAIR;
        } else {
            this.handRank = HandRank.HIGH_CARD;
        }

        return this.handRank;
    }
};

function getCombinations(cards, count) {
    const results = [];

    // Helper recursive function
    function helper(start, combo) {
        // Base case: if we’ve chosen count cards, store a copy
        if (combo.length === count) {
            results.push(new PokerHand([...combo]));
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

const HandRank = Object.freeze({
    INVALID: -1,
    HIGH_CARD: 1,
    ONE_PAIR: 2,
    TWO_PAIR: 3,
    THREE_OF_A_KIND: 4,
    STRAIGHT: 5,
    FLUSH: 6,
    FULL_HOUSE: 7,
    FOUR_OF_A_KIND: 8,
    STRAIGHT_FLUSH: 9,
    ROYAL_FLUSH: 10,
});

// Functions to handle hand rank ties
const HandTieFunctions = {
    [HandRank.HIGH_CARD]: function (hand1, hand2) {
        // Finished

        console.log("High Card:", hand1, hand2);

        const hand1CardsSorted = sortCardsByRank(hand1.cards);
        const hand2CardsSorted = sortCardsByRank(hand2.cards);

        // Cards are sorted by ascending order so we have to start at the last card
        for (let i = hand1CardsSorted.length - 1; i >= 0; i--) {
            if (rankValue(hand1CardsSorted[i]) > rankValue(hand2CardsSorted[i])) {
                return hand1;
            } else if (rankValue(hand1CardsSorted[i]) < rankValue(hand2CardsSorted[i])) {
                return hand2;
            }
        }

        return null;
    },

    [HandRank.ONE_PAIR]: function (hand1, hand2) {
        // Finished

        console.log("One Pair:", hand1, hand2);

        // Check rank of pair
        const hand1_PairRank = Number(Object.keys(hand1.duplicateRanks)[0]);
        const hand2_PairRank = Number(Object.keys(hand2.duplicateRanks)[0]);

        if (hand1_PairRank > hand2_PairRank) {
            return hand1;
        } else if (hand1_PairRank < hand2_PairRank) {
            return hand2;
        }

        // Need to generalize this?

        // Filter hands to cards that are not paired
        const hand1CardsWOPair = sortCardsByRank(hand1.cards.filter(
            (card) => !Object.keys(hand1.duplicateRanks).includes(String(rankValue(card)))
        ));

        const hand2CardsWOPair = sortCardsByRank(hand2.cards.filter(
            (card) => !Object.keys(hand2.duplicateRanks).includes(String(rankValue(card)))
        ));

        for (let i = 2; i >= 0; i--) {
            if (rankValue(hand1CardsWOPair[i]) > rankValue(hand2CardsWOPair[i])) {
                return hand1;
            } else if (rankValue(hand1CardsWOPair[i]) < rankValue(hand2CardsWOPair[i])) {
                return hand2;
            }
        }

        return null;
    },

    [HandRank.TWO_PAIR]: function (hand1, hand2) {
        // Finished

        console.log("Two Pair:", hand1, hand2);

        // Compare the rank of the 2 pairs in the hands
        for (let i = Object.keys(hand1.duplicateRanks).length - 1; i >= 0; i--) {
            const hand1PairRank = Number(Object.keys(hand1.duplicateRanks)[i]);
            const hand2PairRank = Number(Object.keys(hand2.duplicateRanks)[i]);

            if (hand1PairRank > hand2PairRank) {
                return hand1;
            } else if (hand1PairRank < hand2PairRank) {
                return hand2;
            }
        }

        // Filter hands to cards that are not paired
        const hand1CardsWOPair = sortCardsByRank(hand1.cards.filter(
            (card) => !Object.keys(hand1.duplicateRanks).includes(String(rankValue(card)))
        ));

        const hand2CardsWOPair = sortCardsByRank(hand2.cards.filter(
            (card) => !Object.keys(hand2.duplicateRanks).includes(String(rankValue(card)))
        ));

        if (rankValue(hand1CardsWOPair[0]) > rankValue(hand2CardsWOPair[0])) {
            return hand1;
        } else if (rankValue(hand1CardsWOPair[0]) < rankValue(hand2CardsWOPair[0])) {
            return hand2;
        }

        return null;
    },

    [HandRank.THREE_OF_A_KIND]: function (hand1, hand2) {
        // Finished

        // Determined by rank of the triples, then the rank of highest kicker, then rank of 2nd highest kicker (last kicker)

        console.log("Three of a Kind:", hand1, hand2);

        const hand1TripleRank = Number(Object.keys(hand1.duplicateRanks).filter((key) => hand1.duplicateRanks[key] == 3)[0]);
        const hand2TripleRank = Number(Object.keys(hand2.duplicateRanks).filter((key) => hand2.duplicateRanks[key] == 3)[0]);

        if (hand1TripleRank > hand2TripleRank) {
            return hand1;
        } else if (hand1TripleRank < hand2TripleRank) {
            return hand2;
        }

        const hand1WOTriple = sortCardsByRank(hand1.cards.filter(
            (card) => !Object.keys(hand1.duplicateRanks).includes(String(rankValue(card)))
        ));

        const hand2WOTriple = sortCardsByRank(hand2.cards.filter(
            (card) => !Object.keys(hand2.duplicateRanks).includes(String(rankValue(card)))
        ));

        // Cards are sorted by ascending order so we have to start at the last card
        for (let i = hand1WOTriple.length - 1; i >= 0; i--) {
            if (rankValue(hand1WOTriple[i]) > rankValue(hand2WOTriple[i])) {
                return hand1;
            } else if (rankValue(hand1WOTriple[i]) < rankValue(hand2WOTriple[i])) {
                return hand2;
            }
        }

        return null;
    },

    [HandRank.STRAIGHT]: function (hand1, hand2) {
        // Finished

        console.log("Straight:", hand1, hand2);

        const hand1Sorted = sortCardsByRank(hand1.cards);
        const hand2Sorted = sortCardsByRank(hand2.cards);

        const ACE_LOW_PATTERN = ["2*", "3*", "4*", "5*", "A*"];

        let isHand1AceLowStraight = true;

        for (let i = 0; i < hand1Sorted.length; i++) {
            if (rankValue(hand1Sorted[i]) != rankValue(ACE_LOW_PATTERN[i])) {
                isHand1AceLowStraight = false;
                break;
            }
        }

        let isHand2AceLowStraight = true;

        for (let i = 0; i < hand2Sorted.length; i++) {
            if (rankValue(hand2Sorted[i]) != rankValue(ACE_LOW_PATTERN[i])) {
                isHand2AceLowStraight = false;
                break;
            }
        }

        if (isHand1AceLowStraight) {
            hand1Sorted.unshift(hand1Sorted.pop());
        }

        if (isHand2AceLowStraight) {
            hand2Sorted.unshift(hand2Sorted.pop());
        }

        const hand1HighestRank = rankValue(hand1Sorted[hand1Sorted.length - 1]);
        const hand2HighestRank = rankValue(hand2Sorted[hand2Sorted.length - 1]);

        if (hand1HighestRank > hand2HighestRank) {
            return hand1;
        } else if (hand1HighestRank < hand2HighestRank) {
            return hand2;
        }

        return null;
    },

    [HandRank.FLUSH]: function (hand1, hand2) {
        // Finished

        // Determined by highest card then second highest, ...

        console.log("Flush:", hand1, hand2);

        // Sorted in ascending order
        const sortedHand1 = sortCardsByRank(hand1.cards);
        const sortedHand2 = sortCardsByRank(hand2.cards);

        // Check in descending order as the cards are sorted in ascending order
        for (let i = sortedHand1.length - 1; i >= 0; i--) {
            if (rankValue(sortedHand1[i]) > rankValue(sortedHand2[i])) {
                return hand1;
            } else if (rankValue(sortedHand1[i]) < rankValue(sortedHand2[i])) {
                return hand2;
            }
        }

        return null;
    },

    [HandRank.FULL_HOUSE]: function (hand1, hand2) {
        // Finished

        // Determined by rank of triple then rank of pair

        console.log("Full House:", hand1, hand2);

        const hand1TripleRank = Number(Object.keys(hand1.duplicateRanks).filter((key) => hand1.duplicateRanks[key] == 3)[0]);
        const hand1PairRank = Number(Object.keys(hand1.duplicateRanks).filter((key) => hand1.duplicateRanks[key] == 2)[0]);

        const hand2TripleRank = Number(Object.keys(hand2.duplicateRanks).filter((key) => hand2.duplicateRanks[key] == 3)[0]);
        const hand2PairRank = Number(Object.keys(hand2.duplicateRanks).filter((key) => hand2.duplicateRanks[key] == 2)[0]);

        if (hand1TripleRank > hand2TripleRank) {
            return hand1;
        } else if (hand1TripleRank < hand2TripleRank) {
            return hand2;
        }

        if (hand1PairRank > hand2PairRank) {
            return hand1;
        } else if (hand1PairRank < hand2PairRank) {
            return hand2;
        }

        return null;
    },

    [HandRank.FOUR_OF_A_KIND]: function (hand1, hand2) {
        // Finished

        console.log("Four of a Kind:", hand1, hand2);

        const hand1_4Rank = Number(Object.keys(hand1.duplicateRanks)[0]);
        const hand2_4Rank = Number(Object.keys(hand2.duplicateRanks)[0]);

        if (hand1_4Rank > hand2_4Rank) {
            return hand1;
        } else if (hand1_4Rank < hand2_4Rank) {
            return hand2;
        }

        // Handle tie between 4 of a kind rank

        // Filter hands to cards that are not paired
        const hand1CardsWOPair = sortCardsByRank(hand1.cards.filter(
            (card) => !Object.keys(hand1.duplicateRanks).includes(String(rankValue(card)))
        ));

        const hand2CardsWOPair = sortCardsByRank(hand2.cards.filter(
            (card) => !Object.keys(hand2.duplicateRanks).includes(String(rankValue(card)))
        ));

        if (rankValue(hand1CardsWOPair[0]) > rankValue(hand2CardsWOPair[0])) {
            return hand1;
        } else if (rankValue(hand1CardsWOPair[0]) < rankValue(hand2CardsWOPair[0])) {
            return hand2;
        }

        return null;
    },

    [HandRank.STRAIGHT_FLUSH]: function (hand1, hand2) {
        // Finished?

        console.log("Straight Flush:", hand1, hand2);

        // Should be able to use the straight tie-breaker for straight flushes
        return HandTieFunctions[HandRank.STRAIGHT](hand1, hand2);
    },

    [HandRank.ROYAL_FLUSH]: function (hand1, hand2) {
        // Finished

        console.log("Royal Flush:", hand1, hand2);

        return null;
    },
}

// Returns an object of {rank: count, rank1: count, ...} for all ranks that have more than 1 card in ascneding order of rank
// Ranks with only 1 card are not included
// [2, 3, 4, 5, 5] will output {5: 2}
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

    return duplicates;
}

function findBestHand(sevenCards) {
    const hands = getCombinations(sevenCards, 5);

    let bestHandRank = HandRank.INVALID;

    // Used to store the best hands overall (all hands in this will be the same rank)
    let bestHands = [];

    // Find all hands of the best rank
    for (let i = 0; i < hands.length; i++) {
        const currentHand = hands[i];

        const handRank = currentHand.handRank;
        if (handRank == HandRank.ROYAL_FLUSH) {
            bestHandRank = handRank;

            return currentHand;
        }

        if (handRank > bestHandRank) {
            bestHands = [currentHand];
            bestHandRank = handRank;
        } else if (handRank == bestHandRank) {
            bestHands.push(currentHand);
        }
    }

    if (bestHands.length > 1) {
        // find best hand of the rank
        let bestHand = bestHands[0];

        const handRank = bestHands[0].handRank;

        for (let i = 1; i < bestHands.length; i++) {
            const tieWinner = HandTieFunctions[handRank](bestHand, bestHands[i]);

            if (tieWinner == bestHands[i]) {
                bestHand = bestHands[i];
            }
        }

        return bestHand;
    } else {
        return bestHands[0];
    }
}

function deal(state) {
    makeDeck(state);

    for (let player of state.players) {
        player.resetHand();
    }
    
    state.boardCards = [];
    state.phase = 0;

    state.advanceDealer();

    // Deal 2 cards to all players
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < state.players.length; j++) {
            dealCard(state, state.players[j].hand);
        }
    }

    state.message = "Pre-Flop";

    // only show hand of human player
    for (let i = 0; i < state.players.length; i++) {
        if (state.players[i].isHuman) {
            state.players[i].hideHand = false;
        } else {
            state.players[i].hideHand = true;
        }
    }
}

export function fold(origState) {
    let state = { ...origState };

    state.players[0].fold();

    if (!state.areMultiplePlayersActive()) {
        let otherPlayers = state.players.filter((player) => !player.isHuman);

        state.message = `You folded. ${compareHands(state.boardCards, otherPlayers)}`;
        state.phase = 4;

        // show hands of all players
        for (let player of otherPlayers) {
            player.hideHand = false;
        }
    }

    // all players excluding human who folded (generalize this to any player folding)
    // let otherPlayers = state.players.filter((player) => !player.isHuman);

    // state.message = `You folded. ${compareHands(state.boardCards, otherPlayers)}`;
    // state.phase = 4;

    // show hands of all players
    // for (let player of otherPlayers) {
    //     player.hideHand = false;
    // }

    return state;
}

export function nextPhase(origState) {
    let state = { ...origState };

    if (state.phase === 0) {
        burn(state);

        dealCard(state, state.boardCards);
        dealCard(state, state.boardCards);
        dealCard(state, state.boardCards);

        state.phase = 1;
        state.message = "Flop";
    } else if (state.phase === 1) {
        burn(state);

        dealCard(state, state.boardCards);

        state.phase = 2;
        state.message = "Turn";
    } else if (state.phase === 2) {
        burn(state);

        dealCard(state, state.boardCards);

        state.phase = 3;
        state.message = "River";
    } else if (state.phase === 3) {
        // show hands of all players
        for (let player of state.players) {
            player.hideHand = false;
        }

        // gameStatus.textContent = "Showdown: " + compareHands();
        state.phase = 4;
        state.message = "Showdown: " + compareHands(state.boardCards, state.players);
    } else if (state.phase === 4 && (!state.areMultiplePlayersActive())) {
        deal(state);
    }

    return state;
}

function getWinningPlayer(players) {
    let winningHand = players[0].bestHand;

    for (let i = 1; i < players.length; i++) {
        const current = players[i].bestHand;

        if (current.handRank > winningHand.handRank) {
            winningHand = current;
        } else if (current.handRank < winningHand.handRank) {
            winningHand = winningHand;
        } else if (current.handRank === winningHand.handRank) {
            winningHand = HandTieFunctions[current.handRank](winningHand, current);
        }
    }

    if (winningHand === null) {
        return null;
    }

    return players.filter((player) => player.bestHand == winningHand)[0];
}

function compareHands(boardCards, players) {

    // ignore all players who folded
    let activePlayers = players.filter((player) => !player.folded);

    // find best hands of all active players
    for (let player of activePlayers) {
        player.bestHand = findBestHand([...player.hand, ...boardCards]);
    }

    for (let player of activePlayers) {
        console.log(`${player.name} Best Hand: `, player.bestHand);
    }

    let winningPlayer = getWinningPlayer(activePlayers);

    // if (playerBestHand.handRank > computerBestHand.handRank) {
    //     winningHand = playerBestHand;
    // } else if (playerBestHand.handRank < computerBestHand.handRank) {
    //     winningHand = computerBestHand;
    // } else {
    //     // Handle tie where hand ranks are equal
    //     winningHand = HandTieFunctions[playerBestHand.handRank](playerBestHand, computerBestHand);
    // }


    // if (winningHand == playerBestHand) {
    //     return `${localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players'))[0].data.name : "Player"} wins!`;
    // } else if (winningHand == computerBestHand) {
    //     return `${localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players'))[1].data.name : "Computer"} wins!`;
    // } else {
    //     return "It's a tie!";
    // }

    // players are no longer active as the hand has ended
    for (let player of activePlayers) {
        player.isActive = false;
    }

    if (winningPlayer === null) {
        return "It's a tie!";
    }

    return winningPlayer.name + " wins!";
}

export default function createInitialGame(settings) {
    let players = [new Player("Player", "playerHand", "human", true)];

    for (let i = 0; i < settings.cpu_count; i++) {
        players.push(new Player("Computer" + i, "computerHand" + i, "cpu", false, true))
    }

    let dealer = players[Math.floor(Math.random() * players.length)];
    dealer.setDealer(true);

    let state = {
        players: players,
        deck: [],
        pot: 0,
        previousBet: 0,
        dealer: dealer,
        boardCards: [],
        phase: 0,
        message: "Pre-Flop",

        areMultiplePlayersActive: function() {
            let activeCount = 0;
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].isActive) {
                    activeCount++; 
                }
            }

            return activeCount > 1;
        },

        raiseBet: function(player, bet) {
            
        },

        getSmallBlindPlayer: function() {
            let dealerIndex = this.players.indexOf(this.dealer);
            if (dealerIndex == -1) {
                console.error("No dealer set in getSmallBlindPlayer!");

                return null;
            }

            return (dealerIndex == 0) ? this.players[this.players.length - 1] : this.players[dealerIndex - 1];
        },

        getLargeBlindPlayer: function() {
            let dealerIndex = this.players.indexOf(this.dealer);
            if (dealerIndex == -1) {
                console.error("No dealer set in getLargeBlindPlayer!");

                return null;
            }

            return (dealerIndex < 2) ? this.players[this.players.length - dealerIndex - 1] : this.players[dealerIndex - 2];
        },

        advanceDealer: function() {
            // get next player to the left of the current dealer
            let newDealer = this.getSmallBlindPlayer();

            let previousDealer = this.dealer;
            previousDealer.setDealer(false);

            this.dealer = newDealer;
            newDealer.setDealer(true);
        }
    };

    deal(state);
    return state;
}
