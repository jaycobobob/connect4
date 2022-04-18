let api = {
    updateBoard: (board, x, val) => {
        let y = 0;
        // increase y until you reach the bottom of the board or you hit another piece
        while (y < board.length - 1 && !board[y + 1][x].val) {
            y++;
        }
        return { success: true, move: { x: x, y: y } };
    },

    getCPUMove: (board, whoAmI) => {
        // find first open column
        let x = -1;
        for (let col = 0; col < board[0].length; col++) {
            if (!isColumnFull(board, col)) {
                x = col;
                break;
            }
        }
        if (x === -1) {
            return { success: false, msg: "Could not find an open spot." };
        }

        let y = 0;
        // increase y until you reach the bottom of the board or you hit another piece
        while (y < board.length - 1 && !board[y + 1][x].val) {
            y++;
        }
        return { success: true, move: { x: x, y: y } };
    },

    isGameOver: (board) => {
        const dirs = {
            N: [0, -1],
            E: [1, 0],
            S: [0, 1],
            W: [0, -1],
            NE: [1, -1],
            SE: [1, 1],
            SW: [-1, 1],
            NW: [-1, -1],
        };
        const height = board.length;
        const width = board[0].length;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // only check cells with pieces for wins
                if (board[y][x].val) {
                    for (let v2 of Object.values(dirs)) {
                        let start = { x: x, y: y };
                        let end = { x: x + v2[0] * 4, y: y + v2[1] * 4 };

                        // if the end point is within the bounds of the board
                        if (end.x >= 0 && end.x < width && end.y >= 0 && end.y < height) {
                            const target = board[start.y][start.x].val;
                            let match = true;

                            // check every piece bewteen start and end to see if they all match
                            while (start.x !== end.x || start.y !== end.y) {
                                if (board[start.y][start.x].val !== target) {
                                    match = false;
                                    break;
                                }
                                start = { x: start.x + v2[0], y: start.y + v2[1] };
                            }
                            if (match) {
                                return { success: true, winner: target };
                            }
                        }
                    }
                }
            }
        }

        let boardFull = true;
        for (let col = 0; col < board[0].length; col++) {
            if (!isColumnFull(board, col)) {
                boardFull = false;
                break;
            }
        }
        if (boardFull) {
            return { success: true, winner: undefined };
        }
        return { success: false };
    },
};

const isColumnFull = (board, colNum) => {
    for (let y = 0; y < board.length; y++) {
        if (board[y][colNum].val === 0) {
            return false;
        }
    }
    return true;
};

export default api;
