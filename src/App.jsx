import { useState } from "react";

import "../styles/styles.css";

import HomeView from "./HomeView";
import GameView from "./GameView";
import { getDefaultSettings, SettingsView } from "./SettingsView";
import AboutView from "./AboutView";
import RulesView from "./RulesView";
import { createInitialGame } from "./logic/engine";

function App() {
    const [currentView, setCurrentView] = useState("home");

    function setViewToHome() {
        setCurrentView("home");
    }

    const [settings, setSettings] = useState(getDefaultSettings());

    const [game, setGame] = useState(createInitialGame());

    return (
        <>
            {currentView === "home"     && <HomeView setCurrentView={setCurrentView} />}
            {currentView === "game"     && <GameView setViewToHome={setViewToHome} game={game} setGame={setGame} />}
            {currentView === "rules"    && <RulesView setViewToHome={setViewToHome} />}
            {currentView === "settings" && <SettingsView setViewToHome={setViewToHome} />}
            {currentView === "about"    && <AboutView setViewToHome={setViewToHome} />}
        </>
    )
}

export default App;
