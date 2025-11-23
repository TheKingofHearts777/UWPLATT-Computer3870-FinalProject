import { useState } from "react";
import { Button } from "react-bootstrap";

import { nextPhase, fold } from "./logic/engine.js";

function PauseMenu({ resumeGame, setViewToHome }) {
    return (
        <div className="pause-menu-overlay">
            <div className="menu-container">
                <h2>Game Paused</h2>
                <Button className="menu-btn" onClick={resumeGame}>Resume Game</Button>
                {/* Settings button */}
                <Button className="menu-btn" onClick={setViewToHome}>Return to Main Menu</Button>
            </div>
        </div>
    );
}

function CardComponent({ cardText, hidden = false }) {
    const styleObject = !hidden ? ((cardText.endsWith("♥") || cardText.endsWith("♦")) ? { color: "red" } : {}) : {};

    return (
        <div className="card" style={styleObject}>
            {hidden && (<img
                src="../assets/card-back.jpg"
                alt="Card_back"
                style={{ fontSize: "10px", width: "100%", height: "100%" }}></img>)}
            {!hidden && cardText}
        </div >
    )
}

function PlayerHand({ player, name, id }) {
    return (
        <>
            <h3>{name}</h3>
            <div id={id}>
                {player.hand.map((card) => <CardComponent key={card} cardText={card} hidden={player.hideHand} />)}
            </div>
        </>
    );
}

function BoardCards({ boardCards }) {
    return (
        <div id="board">{boardCards.map((card) => <CardComponent key={card} cardText={card} />)}</div>
    );
}

function TableArea({ game, setGame }) {

    function NextPhaseButton() {
        return (
            <Button
                className="menu-btn"
                id="nextBtn"
                onClick={() => setGame(prev => nextPhase(prev))}
            >
                {game.phase !== 4 ? "Next Phase" : "Deal Again"}
            </Button>
        );
    }

    function FoldButton() {
        return (
            <Button
                className="menu-btn"
                id="foldBtn"
                style={{ display: (game.phase !== 4 ? "inline-block" : "none") }}
                onClick={() => setGame(prev => fold(prev))}
            >
                Fold
            </Button>
        );
    }

    return (
        <div id="table-area">
            <h2 id="title">Player vs Computer</h2>
            <BoardCards boardCards={game.boardCards} />

            <PlayerHand player={game.players[0]} name="Hand" id="playerHand" />
            <PlayerHand player={game.players[1]} name="Computer" id="computerHand" />

            <div id="controls">
                <NextPhaseButton />
                <FoldButton />
            </div>

            <p id="status">{game.message}</p>
        </div>
    );
}

function GameView({ setViewToHome, game, setGame }) {

    const [paused, setPaused] = useState(false);

    function pauseGame() {
        setPaused(true);
    }

    function resumeGame() {
        setPaused(false);
    }

    function handleKeyDown(event) {
        if (event.key === "Escape") {
            setPaused(isPaused => !isPaused);
        }
    }

    return (
        <div id="game-area" className="start-game-body" tabIndex={0} onKeyDown={handleKeyDown}>
            {!paused && (
                <Button
                    className="menu-btn"
                    onClick={pauseGame}
                    style={{
                        position: "absolute", top: "20px", left: "20px", zIndex: 1000
                    }}
                >
                    Pause
                </Button>
            )}
            {paused && <PauseMenu resumeGame={resumeGame} setViewToHome={setViewToHome} />}

            <TableArea game={game} setGame={setGame} />
        </div>
    );
}

export default GameView;
