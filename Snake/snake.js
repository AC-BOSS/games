const canvas = document.getElementsByTagName('canvas');
const board = canvas[0].getContext("2d");
const box = 25;
const size = 25;

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}
var bite = new sound("Bite+2.mp3");
var slurp = new sound("Slurp+4.mp3");
var hiss = new sound("snakehiss2.mp3");
var bg = new sound("gameSound.mp3");
bg.sound.volume = 0.5;
bg.sound.loop = true;

let score=0, max=0, snake=[];


let food={
    x: Math.floor(Math.random()*size)*box,
    y: Math.floor(1+Math.random()*size)*box
};
food_update = () =>{
    food.x = Math.floor(Math.random()*size)*box;
    food.y = Math.floor(1+Math.random()*(size-1))*box;
    let flag=0;
    for(let i=0; i<snake.length; ++i)
    {
        if(food.x == snake[i].x && food.y == snake[i].y)
            flag=1;
    }
    if(flag) food_update();
}

let dir='right';
let flag = 0;
direction = (event) => {
    //console.log(event.keyCode);
    if (flag == 1) return;
    if(event.keyCode == 37 && dir != 'right'){
        flag=1;
        dir = 'left';
    }
    else if(event.keyCode == 38 && dir != 'down'){
        flag=1;
        dir = 'up';
    }
    else if(event.keyCode == 39 && dir != 'left'){
        flag=1;
        dir = 'right';
    }
    else if(event.keyCode == 40 && dir != 'up'){
        flag=1;
        dir = 'down';
    }
    //console.log(dir);
    // if(flag){
    //     update();
    //     ate();
    // }
    if (game_over()){
        clearInterval(game);
        let display = "Your Score: "+score;
        document.getElementById('display').innerHTML = display;
    }
}
document.addEventListener('keydown', direction);

let snakeX, snakeY;
update = () => {
    if(dir=='left')
    {
        if(snakeX == 0)
            snakeX = (size-1)*box;
        else  
            snakeX = snakeX-box;
    }
    else if(dir=='up')
    {
        if(snakeY == box)
            snakeY = size*box;
        else  
            snakeY = snakeY-box;
    }
    else if(dir=='right')
    {
        if(snakeX == (size-1)*box)
            snakeX = 0;
        else  
            snakeX = snakeX+box;
    }
    else if(dir=='down')
    {
        if(snakeY == size*box)
            snakeY = box;
        else  
            snakeY = snakeY+box;
    }
    let newHead={
        x:snakeX,
        y:snakeY
    };
    snake.unshift(newHead);
    //console.log(newHead);
}

ate = () => {
    if(snakeX == food.x && snakeY == food.y)
    {
        bite.play();
        food_update();
        ++score;
        ++ate_count;
    }
    else
      snake.pop();
    //console.log(snake);
}

let bonus = new Object();
draw_bonus = () =>{
    let flag = 0;
    bonus.x = Math.floor(Math.random()*(size-1))*box;
    bonus.y = Math.floor(1+Math.random()*(size-2))*box;
    for(let i=0; i<snake.length; ++i){
        if((bonus.x == snake[i].x || bonus.x == snake[i].x-box) && (bonus.y == snake[i].y || bonus.y == snake[i].y-box)){
            flag=1;
        }
    }
    if(flag)
        draw_bonus();
}
check_bonus = () =>{
    //console.log(bonus,snakeX, snakeY);
    if((snakeX == bonus.x || snakeX-box == bonus.x) && (snakeY == bonus.y || snakeY-box == bonus.y)){
        slurp.play();
        score+=Math.floor((max_bonus-bonus_time)/1.5);
        return false;
    }
    if(bonus_time == max_bonus) return false;
    else return true;
}

head = () => {
    let image=document.getElementById('down');
    if(dir=='up'){
        image.setAttribute('style','transform:rotate(180deg)');
    }
    else if(dir=='right'){
        image.setAttribute('style','transform:rotate(90deg)');
    }
    else if(dir=='left'){
        image.setAttribute('style','transform:rotate(270deg)');
    }
    //console.log(image);
    return image;
}
game_over = () => {
    for(let i =1; i<snake.length; ++i)
    {
        if(snakeX == snake[i].x && snakeY == snake[i].y)
            return true;
    }
    return false;
}
const max_bonus=30;
let bonus_time=0;
let isbonus=false;
let ate_count = 0

draw = () => {
    //console.log(dir);
    board.fillStyle = 'lightgreen';
    board.fillRect(0, box, size*box, size*box); 

    board.drawImage(head(),snakeX,snakeY,25,25);
    for(let i=1; i<snake.length; i++) {
        board.fillStyle = 'green';
        board.fillRect(snake[i].x, snake[i].y, box, box);
        //console.log("i=", i, snake[i]);
    }
    //console.log(bonus_time, isbonus, ate_count);
    board.fillStyle = 'red';
    board.fillRect(food.x, food.y, box, box);
    //console.log(food.x, food.y);
    update();
    ate();
    if (ate_count % 10 == 0 && ate_count > 0 && isbonus==false)
    {
        isbonus = true;
        draw_bonus();
        board.fillStyle = 'blue';
        board.fillRect(bonus.x, bonus.y, 2*box, 2*box);
        //console.log('drawn!!');
    }
    //console.log(isbonus);
    if(isbonus == true)
    {
        ++bonus_time;
        isbonus = check_bonus();
        //console.log(isbonus);
        if(isbonus == false){
            bonus_time=0;
            ate_count=0;
        }
        else{
            board.fillStyle = 'blue';
            board.fillRect(bonus.x, bonus.y, 2*box, 2*box);
        }
    }
    if (game_over()){
        clearInterval(game);
        bg.stop();
        bg.sound.currentTime = 0;
        console.log(bg.currentTime);
        hiss.play();
        let display = "Your Score: "+score;
        document.getElementById('display').innerHTML = display;
        start.classList.toggle('disabled');
        start.addEventListener('click', start_game);
    }
    flag = 0;
    board.fillStyle = 'White';
    board.clearRect(0,0,500,25);
    board.font='15px Arial';
    board.fillText("Score:"+score, 0, 0.8*box)
    //console.log(snake);
}
let game;
start_game = () => {
    score=0;
    max=0;
    snake.length = 0;
    snake[0]={
        x: (Math.floor(size/2)*box),
        y: (Math.floor(size/2)*box)
    };
    snakeX=snake[0].x;
    snakeY=snake[0].y;
    bonus_time = 0;
    isbonus = false;
    ate_count = 0;
    document.getElementById('display').innerHTML = '';
    bg.play();
    start.classList.toggle('disabled');
    start.removeEventListener('click', start_game);
    game=setInterval(draw,80);
}
let start = document.getElementById('start');
start.addEventListener('click', start_game);
$(function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          document.getElementById("high").innerHTML =
          "High Score:"+this.responseText;
        }
    };
    request.open("GET", "./high_score.txt", true);
    request.send();
});