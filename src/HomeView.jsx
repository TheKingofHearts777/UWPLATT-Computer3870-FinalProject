import { Button } from "react-bootstrap"

function HomeView({ setCurrentView, startNewGame }) {

    function viewRules() {
        setCurrentView("rules");
    }

    function viewSettings() {
        setCurrentView("settings");
    }

    function viewAbout() {
        setCurrentView("about");
    }

    return (
        <div className="menu-container">
            <h1>Texas Hold 'Em Poker</h1>
            <Button className="menu-btn" onClick={startNewGame}>Start Game</Button>
            <Button className="menu-btn" onClick={viewRules}>Rules</Button>
            <Button className="menu-btn" onClick={viewSettings}>Settings</Button>
            <Button className="menu-btn" onClick={viewAbout}>About</Button>
        </div>
    );
}

export default HomeView;
