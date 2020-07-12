//defines elements of the game
let gameElements = {
    game: document.querySelector("#game"),
    canvas: document.querySelector("#canvas"),
    introduction: document.querySelector("#introduction"),
    startButton: document.querySelector(".startButton"),
    gameOver: document.querySelector("#gameOver"),
    restartButton: document.querySelector(".restartButton"),
    scoreElement: document.querySelector("#score"),
    lifeCountElement: document.querySelector("#lifeCount"),
    score: 0,
    lifeCount: 3,
};

const ctx = gameElements.canvas.getContext("2d");
const canvasW = 500;
const canvasH = 380;

//create the unit
const box = 20;
const rows = 17;
const colums = 24;

//oranges
const orangeImg = new Image();
orangeImg.src = "images/annoying-orange.png";
let oranges = [];

//knifes
const knifeImg = new Image();
knifeImg.src = "images/knife.png";
let knifes = [];

//create the snake
let snake = [];

//control the snake
document.addEventListener("keydown", direction);
let d;

//---------------------------------

function direction(event) {
    if (event.keyCode == 37 && d != "right") {
        d = "left";
        // snake[0].y = Math.round(snake[0].y / box) * box;
    } else if (event.keyCode == 38 && d != "down") {
        d = "up";
        // snake[0].x = Math.round(snake[0].x / box) * box;
    } else if (event.keyCode == 39 && d != "left") {
        d = "right";
        // snake[0].y = Math.round(snake[0].y / box) * box;
    } else if (event.keyCode == 40 && d != "up") {
        d = "down";
        // snake[0].x = Math.round(snake[0].x / box) * box;
    }
}

//check tail collision
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

//check for object collision
function objectColCheck(head, obj) {
    if (
        head[0].x + box <= obj.x ||
        obj.x + obj.width <= head[0].x ||
        head[0].y + box <= obj.y ||
        obj.y + obj.height <= head[0].y
    ) {
        return false;
    }
    return true;
}

//draw everything to the canvas
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasW, canvasH);

    snake.forEach((cell) => {
        ctx.fillStyle = "green";
        ctx.fillRect(cell.x, cell.y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(cell.x, cell.y, box, box);
    });

    //head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    //snake touches knife
    for (i = 0; i < knifes.length; i++) {
        if (objectColCheck(snake, knifes[i])) {
            knifes[i].x = Math.floor(Math.random() * colums) * box;
            knifes[i].y = Math.floor(Math.random() * rows) * box;
            gameElements.lifeCount--;
            gameElements.lifeCountElement.innerHTML = `${gameElements.lifeCount}/3`;
        }
        ctx.drawImage(knifeImg, knifes[i].x, knifes[i].y);
    }

    //snake eats the orange
    for (i = 0; i < oranges.length; i++) {
        if (objectColCheck(snake, oranges[i])) {
            oranges[i].x = Math.floor(Math.random() * colums) * box;
            oranges[i].y = Math.floor(Math.random() * rows) * box;
            gameElements.score++;
            gameElements.scoreElement.textContent = `${gameElements.score}`;
            snake.push(snakeX, snakeY);
        }
        ctx.drawImage(orangeImg, oranges[i].x, oranges[i].y);
    }

    //remove the tail
    snake.pop();
    //move to the direction
    if (d == "left") snakeX -= box;
    if (d == "up") snakeY -= box;
    if (d == "right") snakeX += box;
    if (d == "down") snakeY += box;

    //window limitation
    if (snakeX < 0) {
        snakeX = canvasW - box;
    } else if (snakeX > canvasW - box) {
        snakeX = 0;
    } else if (snakeY < 0) {
        snakeY = canvasH - box;
    } else if (snakeY > canvasH - box) {
        snakeY = 0;
    }

    //new head
    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    //out of lifes || tail collision
    if (gameElements.lifeCount < 1 || collision(newHead, snake)) {
        //+delay
        changeWindow("gameOver");
        gameElements.restartButton.addEventListener("click", startGame);
    } else {
        snake.unshift(newHead);
        // requestAnimationFrame(draw);
        setTimeout(draw, 130);
    }
}

//shows the introduction to the game and on click on the button goes to the startGame function
function introduction() {
    changeWindow("introduction");
    gameElements.startButton.addEventListener("click", startGame);
}

//resets game, creates objects, changes the window to the game window and calls for update
function startGame() {
    resetGame();
    changeWindow("game");
    draw();
}

//function that swiches between windows
function changeWindow(name) {
    gameElements.introduction.style = "none";
    gameElements.gameOver.style = "none";
    gameElements.game.style = "none";

    if (name == "introduction") {
        gameElements.introduction.style.display = "flex";
    } else if (name == "game") {
        gameElements.game.style.display = "flex";
    } else if (name == "gameOver") {
        gameElements.gameOver.style.display = "flex";
    }
}

function resetGame() {
    //resets variables
    gameElements.lifeCount = 3;
    gameElements.score = 0;
    gameElements.lifeCountElement.innerHTML = `${gameElements.lifeCount}/3`;
    gameElements.scoreElement.textContent = `${gameElements.score}`;
    d = null;
    // deletes all snake cells
    for (var i = 0; i < snake.length; i++) {
        snake.splice(i, 1);
    }

    //start position of the player
    snake[0] = {
        x: 12 * box,
        y: 9 * box,
    };

    //generates or regenerates oranges and knifes
    for (i = 0; i < 3; i++) {
        oranges[i] = {
            x: Math.floor(Math.random() * colums) * box,
            y: Math.floor(Math.random() * rows) * box,
            width: box,
            height: box,
        };
    }
    for (i = 0; i < 2; i++) {
        knifes[i] = {
            x: Math.floor(Math.random() * colums) * box,
            y: Math.floor(Math.random() * rows) * box,
            width: 3 * box,
            height: box,
        };
    }
}
//when page loads calls introduction()
window.addEventListener("load", introduction);