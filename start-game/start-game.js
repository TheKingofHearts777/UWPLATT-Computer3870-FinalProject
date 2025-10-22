let returnToMainMenu = document.getElementById('main-menu-btn');

window.onload = function() {
    let titleElement = document.getElementById('title');
    let players = JSON.parse(localStorage.getItem('players')) || [];
    if (players.length > 0) {
        titleElement.textContent = players[0].data.name + " vs " + players[1].data.name;
    }
};

returnToMainMenu.addEventListener('click', () => {
    localStorage.clear();
});