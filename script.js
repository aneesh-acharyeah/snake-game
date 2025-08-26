// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

// Game constants
const gridSize = 20;
const tileCount = 20;
let score = 0;

// Snake initial state
let snake = [
  { x: 10, y: 10 }
];
let dx = 0;
let dy = 0;

// Food
let foodX = 5;
let foodY = 5;

// Game state
let gameOver = false;
let gameLoop;

// Draw game
function draw() {
  if (gameOver) return;

  // Clear canvas
  ctx.fillStyle = '#f9f9f9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Move snake
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Check wall collision
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    endGame();
    return;
  }

  // Check self collision
  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
      return;
    }
  }

  // Add new head
  snake.unshift(head);

  // Check food collision
  if (head.x === foodX && head.y === foodY) {
    score++;
    scoreElement.textContent = score;
    placeFood();
  } else {
    snake.pop(); // Remove tail if no food eaten
  }

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize, gridSize);

  // Draw snake
  ctx.fillStyle = 'green';
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);
  }
}

// Place food at random location
function placeFood() {
  function getRandom() {
    return Math.floor(Math.random() * tileCount);
  }

  let newFood;
  let valid = false;

  while (!valid) {
    newFood = { x: getRandom(), y: getRandom() };
    valid = true;
    // Make sure food doesn't spawn on snake
    for (let i = 0; i < snake.length; i++) {
      if (newFood.x === snake[i].x && newFood.y === snake[i].y) {
        valid = false;
        break;
      }
    }
  }

  foodX = newFood.x;
  foodY = newFood.y;
}

// Game over
function endGame() {
  gameOver = true;
  clearInterval(gameLoop);
  ctx.fillStyle = 'black';
  ctx.font = '30px Arial';
  ctx.fillText('GAME OVER', canvas.width / 2 - 80, canvas.height / 2);
  restartBtn.style.display = 'inline-block';
}

// Restart game
function restartGame() {
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;
  score = 0;
  scoreElement.textContent = score;
  placeFood();
  gameOver = false;
  restartBtn.style.display = 'none';
  gameLoop = setInterval(draw, 150);
}

// Keyboard controls
document.addEventListener('keydown', function (e) {
  if (gameOver) return;

  switch (e.key) {
    case 'ArrowUp':
      if (dy !== 1) { dx = 0; dy = -1; }
      break;
    case 'ArrowDown':
      if (dy !== -1) { dx = 0; dy = 1; }
      break;
    case 'ArrowLeft':
      if (dx !== 1) { dx = -1; dy = 0; }
      break;
    case 'ArrowRight':
      if (dx !== -1) { dx = 1; dy = 0; }
      break;
  }
});

// Restart button
restartBtn.addEventListener('click', restartGame);

// Start game
placeFood();
restartBtn.style.display = 'none';
gameLoop = setInterval(draw, 150);
