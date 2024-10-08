const SIDE = 3;
const HUMAN = 'X';
const COMPUTER = 'O';

let board = Array(SIDE).fill(null).map(() => Array(SIDE).fill(null));
let currentPlayer = HUMAN;
let gameActive = true;

const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const cells = document.querySelectorAll('[data-cell]');

function startGame() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick, { once: true });
    });
    setStatus("Your turn");
}

function handleCellClick(e) {
    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);
    const row = Math.floor(index / SIDE);
    const col = index % SIDE;

    if (board[row][col] || !gameActive) return;

    placeMark(cell, row, col, currentPlayer);

    if (checkWin(board, currentPlayer)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        currentPlayer = COMPUTER;
        setStatus("Computer's turn");
        setTimeout(computerMove, 500);
    }
}

function placeMark(cell, row, col, player) {
    board[row][col] = player;
    cell.textContent = player;
}

function computerMove() {
    const bestMove = getBestMove(board);
    const cell = cells[bestMove.row * SIDE + bestMove.col];
    placeMark(cell, bestMove.row, bestMove.col, COMPUTER);

    if (checkWin(board, COMPUTER)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        currentPlayer = HUMAN;
        setStatus("Your turn");
    }
}

function getBestMove(board) {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < SIDE; i++) {
        for (let j = 0; j < SIDE; j++) {
            if (board[i][j] === null) {
                board[i][j] = COMPUTER;
                let score = minimax(board, 0, false);
                board[i][j] = null;
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { row: i, col: j };
                }
            }
        }
    }

    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin(board, HUMAN)) return -10 + depth;
    if (checkWin(board, COMPUTER)) return 10 - depth;
    if (isDraw()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < SIDE; i++) {
            for (let j = 0; j < SIDE; j++) {
                if (board[i][j] === null) {
                    board[i][j] = COMPUTER;
                    let score = minimax(board, depth + 1, false);
                    board[i][j] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < SIDE; i++) {
            for (let j = 0; j < SIDE; j++) {
                if (board[i][j] === null) {
                    board[i][j] = HUMAN;
                    let score = minimax(board, depth + 1, true);
                    board[i][j] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

function checkWin(board, player) {
    // Check rows, columns and diagonals
    for (let i = 0; i < SIDE; i++) {
        if (board[i][0] === player && board[i][1] === player && board[i][2] === player) return true;
        if (board[0][i] === player && board[1][i] === player && board[2][i] === player) return true;
    }
    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) return true;
    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) return true;
    return false;
}

function isDraw() {
    return board.every(row => row.every(cell => cell !== null));
}

function endGame(draw) {
    gameActive = false;
    if (draw) {
        setStatus("It's a draw!");
    } else {
        setStatus(`${currentPlayer === HUMAN ? "You win!" : "Computer wins!"}`);
    }
}

function setStatus(message) {
    statusElement.textContent = message;
}

function restartGame() {
    board = Array(SIDE).fill(null).map(() => Array(SIDE).fill(null));
    gameActive = true;
    currentPlayer = HUMAN;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.removeEventListener('click', handleCellClick);
    });
    startGame();
}

restartButton.addEventListener('click', restartGame);

startGame();