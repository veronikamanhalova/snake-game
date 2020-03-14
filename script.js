const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
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
for (i = 0; i < 3; i++) {
    oranges[i] = {
        x: Math.floor(Math.random() * colums) * box,
        y: Math.floor(Math.random() * rows) * box,
        width: box,
        height: box
    };
}

//knifes
const knifeImg = new Image();
knifeImg.src = "images/knife.png";
let knifes = [];
for (i = 0; i < 2; i++) {
    knifes[i] = {
        x: Math.floor(Math.random() * colums) * box,
        y: Math.floor(Math.random() * rows) * box,
        width: 3 * box,
        height: box
    };
}

//create the snake
let snake = [];
snake[0] = {
    x: 12 * box,
    y: 9 * box
};

//control the snake
document.addEventListener("keydown", direction);
let d;

//game freakvency
let game = setInterval(draw, 130);

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

    snake.forEach(cell => {
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
        }
        ctx.drawImage(knifeImg, knifes[i].x, knifes[i].y);
    }

    //snake eats the orange
    for (i = 0; i < oranges.length; i++) {
        if (objectColCheck(snake, oranges[i])) {
            oranges[i].x = Math.floor(Math.random() * colums) * box;
            oranges[i].y = Math.floor(Math.random() * rows) * box;
            // snake.push(snakeX, snakeY);
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
        y: snakeY
    };

    //tail collision
    if (collision(newHead, snake)) {
        clearInterval(game);
    }

    snake.unshift(newHead);
}