import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";

import { nextPhase, fold } from "./logic/engine.js";

import cardBackImage from "../assets/card-back.jpg";

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
    const styleObject =
        !hidden && (cardText.endsWith("♥") || cardText.endsWith("♦"))
            ? { color: "red" }
            : {};

    return (
        <div className="card" style={styleObject}>
            {hidden && (
                <img
                    src={cardBackImage}
                    alt="Card_back"
                    style={{ fontSize: "10px", width: "100%", height: "100%" }}
                />
            )}
            {!hidden && cardText}
        </div>
    );
}

// UPDATED: added "position" and seat wrapper
function PlayerHand({ player, name, id, position }) {
    const seatClass = `player-seat pos-${position || "center"}`;

    return (
        <div className={seatClass} data-player-id={id}>
            <h3>
                {name} {player.isDealer && "(Dealer)"}{" "}
                {player.folded && "(Folded)"}
            </h3>
            <div className="player-hand">
                {player.hand.map((card) => (
                    <CardComponent
                        key={card}
                        cardText={card}
                        hidden={player.hideHand}
                    />
                ))}
            </div>
        </div>
    );
}

function BoardCards({ boardCards }) {
    return (
        <div id="board">
            {boardCards.map((card) => (
                <CardComponent key={card} cardText={card} />
            ))}
        </div>
    );
}

function TableArea({ game, setGame }) {
    const humanPlayer = game.players.filter((player) => player.isHuman)[0];

    const timerRef = useRef(null);

    function advancePhase() {
        setGame((prev) => {
            const updated = nextPhase(prev);

            if (updated.phase === 4) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            return updated;
        });
    }

    // Autoplay system when the human player folds with more than 1 other player still active
    useEffect(() => {
        if (
            humanPlayer.folded &&
            game.areMultiplePlayersActive() &&
            !timerRef.current
        ) {
            timerRef.current = setInterval(advancePhase, 1500); // 1.5 seconds for each phase
        }

        // Cleanup when component unmounts or dependencies change
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [humanPlayer.folded]);

    function NextPhaseButton() {
        return (
            <Button className="menu-btn" id="nextBtn" onClick={advancePhase}>
                {game.phase !== 4 ? "Next Phase" : "Deal Again"}
            </Button>
        );
    }

    function FoldButton() {
        return (
            <Button
                className="menu-btn"
                id="foldBtn"
                style={{
                    display:
                        game.phase !== 4 && !humanPlayer.folded
                            ? "inline-block"
                            : "none",
                }}
                onClick={() => setGame((prev) => fold(prev))}
            >
                Fold
            </Button>
        );
    }

    // NEW: layout map based on player count
    const playerCount = game.players.length;

    const seatLayouts = {
        2: ["top-center", "bottom-center"],
        3: ["top-center", "middle-left", "middle-right"],
        4: ["top-center", "middle-left", "bottom-center", "middle-right"],
    };

    const activeLayout =
        seatLayouts[playerCount] || seatLayouts[Math.min(playerCount, 4)];

    const playerHands = game.players.map((player, index) => {
        const position = activeLayout[index] || "center";
        return (
            <PlayerHand
                key={player.id}
                player={player}
                name={player.name}
                id={player.id}
                position={position}
            />
        );
    });

    return (
        <div id="table-area">
            <h2 id="title">Player vs Computer(s)</h2>

            <div className="grid-players">
                {/* Center cell: River cards */}
                <div
                    className="board-center"
                    style={{
                        width: `${game.boardCards.length * 80}px`,
                        minWidth: "120px",
                    }}
                >
                    <BoardCards boardCards={game.boardCards} />
                </div>

                {playerHands}
            </div>

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
            setPaused((isPaused) => !isPaused);
        }
    }

    return (
        <div
            id="game-area"
            className="start-game-body"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {!paused && (
                <Button
                    className="menu-btn"
                    onClick={pauseGame}
                    style={{
                        position: "absolute",
                        top: "20px",
                        left: "20px",
                        zIndex: 1000,
                    }}
                >
                    Pause
                </Button>
            )}
            {paused && (
                <PauseMenu
                    resumeGame={resumeGame}
                    setViewToHome={setViewToHome}
                />
            )}

            <TableArea game={game} setGame={setGame} />
        </div>
    );
}

export default GameView;
