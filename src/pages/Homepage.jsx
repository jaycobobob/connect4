import React, { useState } from "react";
import Board from "../components/Board";

const Homepage = () => {
    let [turn, setTurn] = useState(0);
    let [winner, setWinner] = useState(0);

    let message = "";

    if (winner === 0) {
        if (turn === 0) {
            message = "Click any circle to begin.";
        } else if (turn === 1) {
            message = "Your turn";
        } else if (turn === 2) {
            message = "CPU turn";
        }
    } else if (winner === 1) {
        message = "You win!";
    } else if (winner === 2) {
        message = "You lose.";
    } else {
        message = "It was a tie!";
    }

    return (
        <div className="">
            <div className="d-flex p-2 bg-primary justify-content-between">
                <h1 className="h1 text-light">Play Connect 4 Online</h1>
                <a className="h2 text-light" href="/scores">
                    High Scores
                </a>
            </div>
            <div className="d-flex p-5 justify-content-between">
                <div className="rules">
                    <h1 className="text-center">
                        <small>How to Play:</small>
                    </h1>
                    <ul>
                        <li>You are RED.</li>
                        <li>Your opponent is YELLOW.</li>
                        <li>
                            Click a circle to drop a piece. Pieces move as far down as they can.
                        </li>
                        <li>Get 4 pieces in a row before your opponent does.</li>
                    </ul>
                </div>
                <div>
                    <Board width="7" height="6" size="64" setWinner={setWinner} setTurn={setTurn} />
                    <div className="d-flex justify-content-center">
                        <h1>
                            <small>{message}</small>
                        </h1>
                    </div>
                </div>
                <div>
                    <a className="btn btn-danger" href="/connect4">
                        New Game
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
