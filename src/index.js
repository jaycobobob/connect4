import React from "react";
import { createRoot } from "react-dom/client";

import "bootstrap/dist/css/bootstrap.css";

import Board from "./components/Board";

const container = document.getElementById("root");
const root = createRoot(container);

const createGrid = (width, height) => {
    let out = [];
    for (let i = 0; i < height; i++) {
        let temp = [];
        for (let j = 0; j < width; j++) {
            temp.push({ x: j, y: i, val: 0 });
        }
        out.push(temp);
    }
    return out;
};
let board = createGrid(7, 6);

root.render(<Board board={board} width={7} height={6} size={64} />);
