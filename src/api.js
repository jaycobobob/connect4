const mode = 0;
const address =
    mode === 1 ? "http://localhost:3000" : "https://jaycobobob-connect4-backend.herokuapp.com";
console.log(`Querying API at ${address}`);

const api = {
    drop: (board, x) => {
        return fetch(address + `/board/drop/${JSON.stringify(board)}/${x}`).then((res) =>
            res.json()
        );
    },

    getCPUMove: (board, difficulty) => {
        return fetch(address + `/cpu/${difficulty}/${JSON.stringify(board)}`).then((res) =>
            res.json()
        );
    },

    isGameOver: (board) => {
        return fetch(address + `/board/isGameOver/${JSON.stringify(board)}`).then((res) =>
            res.json()
        );
    },

    getNewBoard: (width, height) => {
        return fetch(address + `/board/new/${width}/${height}`).then((res) => res.json());
    },
};

export default api;
