const cells = document.querySelectorAll('.cell');
const resetBtn = document.querySelector('.reset-btn');
const winnerMessage = document.querySelector('.winner-message');
const board = document.querySelector('.game-board');
let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());

    checkForWinner();
}

function checkForWinner() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }

        if (a === b && b === c) {
            roundWon = true;
            drawWinningLine(winCondition);
            triggerWinAnimation(currentPlayer);
            break;
        }
    }

    if (roundWon) {
        winnerMessage.textContent = `Player ${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }

    const roundDraw = !gameState.includes('');
    if (roundDraw) {
        winnerMessage.textContent = 'It\'s a draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function drawWinningLine(winCondition) {
    const firstCell = document.querySelector(`[data-index='${winCondition[0]}']`);
    const lastCell = document.querySelector(`[data-index='${winCondition[2]}']`);

    const firstRect = firstCell.getBoundingClientRect();
    const lastRect = lastCell.getBoundingClientRect();

    const boardRect = board.getBoundingClientRect();

    const line = document.createElement('div');
    line.classList.add('winner-line');

    const x1 = firstRect.left + firstRect.width / 2 - boardRect.left;
    const y1 = firstRect.top + firstRect.height / 2 - boardRect.top;
    const x2 = lastRect.left + lastRect.width / 2 - boardRect.left;
    const y2 = lastRect.top + lastRect.height / 2 - boardRect.top;

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    line.style.width = `${length}px`;
    line.style.top = `${y1}px`;
    line.style.left = `${x1}px`;
    line.style.transform = `rotate(${angle}deg)`;

    // Set the line color based on the winner
    line.style.backgroundColor = currentPlayer === 'X' ? 'blue' : 'red';  // Blue for X, Red for O

    board.appendChild(line);
}

function triggerWinAnimation(player) {
    const body = document.body;
    if (player === 'X') {
        body.classList.add('x-wins');  // Flash blue for X
    } else if (player === 'O') {
        body.classList.add('o-wins');  // Flash red for O
    }
}

function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    winnerMessage.textContent = '';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner');
    });
    const line = document.querySelector('.winner-line');
    if (line) {
        line.remove();
    }
    document.body.classList.remove('x-wins', 'o-wins');  // Remove the animation class
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
