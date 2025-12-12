import { Button, Container } from "react-bootstrap"

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
        <Container className="menu-container d-flex flex-column justify-content-center gap-2">
            <h1>Texas Hold 'Em Poker</h1>
            <Button className="menu-btn" onClick={() => setCurrentView("login")}>Login</Button>
            <Button className="menu-btn" onClick={startNewGame}>Start Game</Button>
            <Button className="menu-btn" onClick={viewRules}>Rules</Button>
            <Button className="menu-btn" onClick={viewSettings}>Settings</Button>
            <Button className="menu-btn" onClick={viewAbout}>About</Button>
        </Container>
    );
}

export default HomeView;
