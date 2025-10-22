import { player } from '../player/player.js';

const startGameButton = document.getElementById('start-game-btn');

startGameButton.addEventListener('click', (e) => {
    e.preventDefault();

    const playerName = (document.getElementById('player-name-input').value || 'Player').trim();
    const startingMoney = Number(document.getElementById('starting-money-input').value) || 1000;
    const numPlayers = Math.max(1, parseInt(document.getElementById('number-of-players-input').value, 10) || 2);

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
