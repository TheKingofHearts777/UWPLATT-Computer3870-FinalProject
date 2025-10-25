import { player } from '../player/player.js';

const startGameButton = document.getElementById('start-game-btn');
const startGameForm = document.getElementById('start-game-form');

function getPlayerName() {
    return (document.getElementById('player-name-input').value || 'Player').trim();
}

function getStartingMoney() {
    const stringValue = document.getElementById('starting-money-input').value;
    if (stringValue === "") {
        return 1000;
    }

    return Number(stringValue) || 1000;
}

function getPlayerCount() {
    let numPlayers = 2;
    if (document.getElementById('number-of-players-input').value !== "") {
        let playerCountInput = parseInt(document.getElementById('number-of-players-input').value, 10);
        
        numPlayers = Math.min(Math.max(2, playerCountInput), 4);
    }

    return numPlayers;
}

startGameForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const playerName = getPlayerName();
    const startingMoney = getStartingMoney();

    const numPlayers = getPlayerCount();

    const players = [];

    // create human player
    players.push({
        type: 'human',
        data: { id: 0, name: playerName, money: startingMoney }
    });

    // create CPU players
    for (let i = 1; i < numPlayers; i++) {
        players.push({
            type: 'cpu',
            data: { id: 1, name: player.generateCPUName(), money: startingMoney }
        });
    }

    // persist as JSON
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('numPlayers', String(players.length));

    console.log('Pregame info saved to localStorage.', players);
    window.location.href = '../start-game/start-game.html';
});
