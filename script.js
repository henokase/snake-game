const gameBoard = document.querySelector('.gameBoard');
const resetBtn = document.querySelector('.reset-btn');
const restartBtn = document.querySelector('.restart-btn');
const controls = document.querySelector('.controls');
const warning = document.querySelector('.warning');
const yesBtn = document.querySelector('.yes-btn');
const high = document.querySelector('.hBox');
const noBtn = document.querySelector('.no-btn');
const scoreText = document.querySelector('.current-score');
const highScoreText = document.querySelector('.high-score');

const ctx = gameBoard.getContext('2d');
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const unitSize = 25;

let running = false;
let foodX;
let foodY;
let score = 0;
let highScore = 0;
let xVelocity = unitSize;
let yVelocity = 0;
let started = false;
let snake = [
    {x:unitSize * 5, y:unitSize},
    {x:unitSize * 4, y:unitSize},
    {x:unitSize * 3, y:unitSize},
    {x:unitSize * 2, y:unitSize},
    {x:unitSize, y:unitSize},
];


controls.addEventListener('click', (event) => {
    const direction = event.target.classList;
    changeDirection(direction[0]);
});
window.addEventListener('keydown', (event) => {
    if(event.key === ' ') {
        restartGame();
    } else {
        changeDirection(event.key);
    }
});
restartBtn.addEventListener('click', restartGame);
yesBtn.addEventListener('click', () => {
    resetGame();
    warning.style.display = 'none';
});
noBtn.addEventListener('click', () => {
    warning.style.display = 'none';
});
resetBtn.addEventListener('click', () => {
    if(!running) warning.style.display = 'flex';
});

loadHighScore();
drawSnake();
createFood();
drawFood();

function gameStart() {
    running = true;
    high.classList.remove('high');
    nextTick();
}

function nextTick() {
    if(!running) {
        checkHighScore();
        displayGameOver();
        return;
    }
    setTimeout(() => {
        clearBoard();
        drawFood();
        moveSnake();
        drawSnake();
        checkGameOver();
        nextTick();
    }, 70);
}

async function checkHighScore() {
    if(highScore < score) {
        highScore = score;
        highScoreText.textContent = highScore;
        high.classList.add('high');
    }
    saveHighScore();
}

function getRandomCoordinate(max) {
    return Math.floor(Math.random() * (max / unitSize)) * unitSize;
}

function createFood() {
    [foodX, foodY] = (() => {
        let x, y;
        let foodOverlap = true;
        while (foodOverlap) {
            x = getRandomCoordinate(gameWidth);
            y = getRandomCoordinate(gameHeight);
            foodOverlap = snake.some(part => part.x === x && part.y === y);
        }
        return [x, y];
    })();
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(foodX + unitSize / 2, foodY + unitSize / 2, unitSize / 2, 0, Math.PI * 2);
    ctx.fill();
}

function moveSnake() {
    const head = { x:snake[0].x + xVelocity, y:snake[0].y + yVelocity };
    snake.unshift(head);

    if(snake[0].x === foodX && snake[0].y === foodY) {
        score++;
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach((part, i) => {
        if(i === 0) ctx.fillStyle = 'lightgrey';
        else ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(part.x + unitSize / 2, part.y + unitSize / 2, unitSize / 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function changeDirection(dir) {
    if(!started && (dir === 'ArrowUp' || dir === 'ArrowDown' || dir === 'ArrowRight')) {
        started = true;
        gameStart();
    }

    switch(true) {
        case(dir === 'ArrowUp' && yVelocity !== unitSize):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case(dir === 'ArrowDown' && yVelocity !== -unitSize):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
        case(dir === 'ArrowRight' && xVelocity !== -unitSize):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case(dir === 'ArrowLeft' && xVelocity !== unitSize):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
    }
}

function clearBoard() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
}

function checkGameOver() {
    switch(true) {
        case(snake[0].x < 0):
            running = false;
            break;
        case(snake[0].x >= gameWidth):
            running = false;
            break;
        case(snake[0].y < 0):
            running = false;
            break;
        case(snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for(let i = 1; i < snake.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false;
        }
    }
}

function displayGameOver() {
    ctx.font = '70px Tektur';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER!', gameWidth / 2, gameHeight / 2);
    running = false;
}

function restartGame() {
    if(!running) {
        score = 0;
        scoreText.textContent = score;
        xVelocity = unitSize;
        yVelocity = 0;
        snake = [
            {x:unitSize * 5, y:unitSize},
            {x:unitSize * 4, y:unitSize},
            {x:unitSize * 3, y:unitSize},
            {x:unitSize * 2, y:unitSize},
            {x:unitSize, y:unitSize},
        ];
        clearBoard();
        createFood();
        drawFood();
        drawSnake();
        started = false;
    }
}

function resetGame() {
    highScore = 0;
    saveHighScore();
    highScoreText.textContent = highScore;
    restartGame();
}

function saveHighScore() {
    localStorage.setItem('High Score', highScore);
}

function loadHighScore() {
    highScore = localStorage.getItem('High Score');
    if(highScore === null) {
        highScore = 0;
    }
    highScoreText.textContent = highScore;
}
