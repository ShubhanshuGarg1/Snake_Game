const gameBoard=document.querySelector("#board");
const ctx=gameBoard.getContext("2d");
const scoreText=document.querySelector("#scoretext");
const resetbtn=document.querySelector("#reset");
const gameWidth=gameBoard.width;
const gameheight=gameBoard.height;
const backgroundcolor="lightgreen";
const snakecolor="lightblue";
const snakeBorder="black";
const foodcolor="red";
const unitSize=25;
const foodSound=new Audio('food.mp3');
const gameOverSound=new Audio('gameover.mp3');
const moveSound=new Audio('move.mp3');
const musicSound=new Audio('music.mp3');
let running=false;
let xvelocity=unitSize;
let yvelocity=0;
let foodX;
let foodY;
let score=0;
let snake=[
    {x: unitSize*4, y:0},
    {x: unitSize*3, y:0},
    {x: unitSize*2, y:0},
    {x: unitSize, y:0},
    {x:0, y:0}
];

window.addEventListener("keydown", changeDirection);
resetbtn.addEventListener("click", resetGame);

gameStart();

function gameStart(){
    musicSound.play();
    running=true;
    scoreText.textContent=score;
    createFood();
    drawFood();
    nextTick();
};
function nextTick(){
    if(running){
        setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 100);
    }
    else{
        displayGameOver();
    }
};
function clearBoard(){
    ctx.fillStyle=backgroundcolor;
    ctx.fillRect(0, 0, gameWidth, gameheight);
};
function createFood(){
    function randomFood(min, max){
        const randNum=Math.round((Math.random()*(max-min)+min)/unitSize)*unitSize;
        return randNum;
    }
    foodX=randomFood(0, gameWidth-unitSize);
    foodY=randomFood(0, gameWidth-unitSize);
};
function drawFood(){
    ctx.fillStyle=foodcolor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};
function moveSnake(){
    const head={x: snake[0].x+xvelocity,
                y: snake[0].y+yvelocity};
    snake.unshift(head);
    if(snake[0].x==foodX&&snake[0].y==foodY){
        foodSound.play();
        score+=1;
        scoreText.textContent=score;
        createFood();
    }
    else{
        snake.pop();
    }
};
function drawSnake(){
    ctx.fillStyle=snakecolor;
    ctx.strokeStyle=snakeBorder;
    snake.forEach(snakePart=>{
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};
function changeDirection(event){
    const keyPressed=event.keyCode;
    const LEFT=37;
    const UP=38;
    const RIGHT=39;
    const DOWN=40;

    const goingup=(yvelocity==-unitSize);
    const goingdown=(yvelocity==unitSize);
    const goingright=(xvelocity==unitSize);
    const goingleft=(xvelocity==-unitSize);

    switch(true){
        case(keyPressed==LEFT&&!goingright):
            moveSound.play();
            xvelocity=-unitSize;
            yvelocity=0;
            break;
        case(keyPressed==UP&&!goingdown):
            moveSound.play();
            xvelocity=0;
            yvelocity=-unitSize;
            break;
        case(keyPressed==RIGHT&&!goingleft):
            moveSound.play();
            xvelocity=unitSize;
            yvelocity=0;
            break;
        case(keyPressed==DOWN&&!goingup):
            moveSound.play();
            xvelocity=0;
            yvelocity=unitSize;
            break;
    }
};
function checkGameOver(){
    switch(true){
        case(snake[0].x<0):
            running=false;
            break;
        case(snake[0].x>=gameWidth):
            running=false;
            break;
        case(snake[0].y<0):
            running=false;
            break;
        case(snake[0].y>=gameheight):
            running=false;
            break;
    }
    for(let i=1; i<snake.length; i++){
        if(snake[i].x==snake[0].x&&snake[i].y==snake[0].y){
            running=false;
        }
    }
};
function displayGameOver(){
    ctx.font="50px MV Boli";
    ctx.fillStyle="black";
    ctx.textAlign="center";
    ctx.fillText("GAME OVER!", gameWidth/2, gameheight/2);
    running=false;
    musicSound.pause();
    gameOverSound.play();
};
function resetGame(){
    score=0;
    xvelocity=unitSize;
    yvelocity=0;
    snake=[
        {x: unitSize*4, y:0},
        {x: unitSize*3, y:0},
        {x: unitSize*2, y:0},
        {x: unitSize, y:0},
        {x:0, y:0}
    ];
    gameStart();
};