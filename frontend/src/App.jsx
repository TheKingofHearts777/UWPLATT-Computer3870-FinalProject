import { useState } from "react";

import "../styles/styles.css";

import HomeView from "./HomeView";
import GameView from "./GameView";
import { getDefaultSettings, SettingsView } from "./SettingsView";
import AboutView from "./AboutView";
import RulesView from "./RulesView";
import LoginView from "./LoginView";
import createInitialGame from "./logic/engine";

function App() {
    const [currentView, setCurrentView] = useState("home");

    function setViewToHome() {
        setCurrentView("home");
    }

    const [settings, setSettings] = useState(getDefaultSettings());
    const [game, setGame] = useState(null);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    function startGame() {
        const newGame = createInitialGame(settings);
        setGame(newGame);
        setCurrentView("game");
    }

    return (
        <>
            {currentView === "login"    && <LoginView setCurrentView={setCurrentView} setUsername={username} setPassword={password}/>}
            {currentView === "home"     && <HomeView setCurrentView={setCurrentView} startNewGame={startGame} />}
            {currentView === "game"     && <GameView setViewToHome={setViewToHome} game={game} setGame={setGame} />}
            {currentView === "rules"    && <RulesView setViewToHome={setViewToHome} />}
            {currentView === "settings" && <SettingsView setViewToHome={setViewToHome} settings={settings} setSettings={setSettings} />}
            {currentView === "about"    && <AboutView setViewToHome={setViewToHome} />}
        </>
    )
}

export default App;
