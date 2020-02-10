//PANTALLA JUEGO------------------------------------------------
function listenerGame() {
  document.addEventListener("keydown",function(evento){
    if(!nivel.gameover){
      if(evento.keyCode == 65 || evento.keyCode == 97){
        mover("mid");
      }
      else if(evento.keyCode == 81 || evento.keyCode == 113){
        mover("top");
      }
      else if(evento.keyCode == 90 || evento.keyCode == 122){
        mover("bot");
      }
    }
    else{
      if(evento.keyCode == 82 || evento.keyCode == 114){
        canvasEnd.style.display = "none";
        canvas.style.opacity = "1";
        nivel.velocidad = 15;
        destroyEnemies();
        createEnemies();
        nivel.score = 0;
        nivel.gameover = false;
        audio = audios[getRandomInt(0,3)];
        audio.play();
      }
      else if(evento.keyCode == 27){
        clearInterval(id);
        canvasEnd.style.display = "none";
        canvas.style.display = "none";
        canvas.style.opacity = "1";
        nivel.velocidad = 15;
        destroyEnemies();
        createEnemies();
        nivel.score = 0;
        nivel.gameover = false;
        audio.pause();
        menu.style.display = "block";
      }
      
    }
    
  });
}

//----------------------------------------------------
//CANVAS----------------------------------------------
let canwidth = 1000;
let canheight = 400;

let canvas, ctx, canvasEnd, ctxEnd;

function iniciar(){
  canvas = document.querySelector("#canvas-game");
  canvas.style.display = "block";
  ctx = canvas.getContext("2d");
  cargarImages();
  canvasEnd = document.querySelector("#canvas-end");
  ctxEnd = canvasEnd.getContext("2d");
  borrarCanvas();
}

function borrarCanvas(){
  canvas.width = canwidth;
  canvas.height = canheight;
}



//carga de imagenes e inicializacion---------------------
let ninjaImg, enemyImg, buttonImg, heroImg, platImg, teclasImg,gameoverImg, restartImg, backImg;

function cargarImages(){
  enemyImg = new Image();
  buttonImg = new Image();
  heroImg = new Image();
  platImg = new Image();
  teclasImg = new Image();
  gameoverImg = new Image();
  restartImg = new Image();
  backImg = new Image();
  enemyImg.src = "img/villain2.png";
  buttonImg.src = "img/button.png";
  heroImg.src = "img/hero.png";
  platImg.src = "img/plattest.png";
  teclasImg.src = "img/teclas.png";
  gameoverImg.src = "img/gameover.png";
  restartImg.src = "img/restart.png";
  backImg.src = "img/back.png";
}

let carriles = ["mid","top","bot"];
let suelos = {"bot":280, "mid": 170, "top":60};
let hero;
let enemy = {"x":Math.round(Math.random()*1200),"y":suelos.mid,"velx":0}
let enemies = [];
let buttons = {"bot":suelos.bot, "mid": suelos.mid, "top":suelos.top, "left":20}
let platform = {"x":0, "y":0}
let nivel = {"velocidad": 15, "enemigos":3, "gameover":false,"score":0};


function drawButtons(){
  ctx.drawImage(teclasImg,0,0,338,284,buttons.left,buttons.top+25,50,50);
  ctx.drawImage(teclasImg,338,0,338,284,buttons.left,buttons.mid+25,50,50);
  ctx.drawImage(teclasImg,676,0,338,284,buttons.left,buttons.bot+25,50,50);
}
//acciones HERO--------------------

function mover(pos){
  if(pos == "bot"){
    hero.posy = buttons.bot;
  }else if(pos == "mid"){
    hero.posy = buttons.mid;
  }else if(pos == "top"){
    hero.posy = buttons.top;
  }
}


//Elige un carril random 
function randomCarril(){
  let number = Math.round(Math.random()*2);
  return carriles[number];
}

//DRAW PLATFOMRS-------------------------------------------
function drawPlatforms(){
  ctx.drawImage(platImg,platform.x,0,800,180,-130,suelos.mid+70,1800,70);
  ctx.drawImage(platImg,platform.x,0,800,180,-130,suelos.top+70,1800,70);
  ctx.drawImage(platImg,platform.x,0,800,180,-130,suelos.bot+70,1800,70);
}

function movePlatform(){
  if(platform.x > 200){
    platform.x = 0;
  }
  else{
    platform.x += nivel.velocidad*1.1;
  }
}

function colision(hero, enemies) {
  for(let i = 0; i < enemies.length; i++){
    let actualEnemy = enemies[i];
    if(hero.posy == actualEnemy.posy && (hero.posx+70 > actualEnemy.posx && hero.posx < actualEnemy.posx+70)){
      nivel.velocidad = 0;
      nivel.gameover = true;
      audio.pause();
    }
  }
  
}
//---------------------------------------------------------
function upScore() {
  if(nivel.velocidad){
    nivel.score++;
  }
}
function pantalla() {
  ctx.font = "30px impact";
  ctx.fillStyle = "#ff0000";
  ctx.fillText(`Score: ${nivel.score}`, 800,60);
  if(nivel.gameover){
    canvas.style.opacity = "0.5";
    canvasEnd.style.display = "block";
    ctxEnd.drawImage(gameoverImg,0,0,567,284,0,0,300,100);
    ctxEnd.drawImage(restartImg,0,0,600,40,0,100,300,20);
    ctxEnd.drawImage(backImg,0,0,600,40,0,120,300,20);
  }
}


//FUNCION RANDOM ENTERO-----------------------
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//ClASES-----------------------------------------------------
class Enemy{
  constructor(x,y,vel,anchoOrig,altoOrig,columns){
    this.posx = x;
    this.posy = y;
    this.velocity=vel;
    this.wOrig = anchoOrig;
    this.hOrig = altoOrig;
    this.cols = columns;
    this.frame = 0;
    this.srcX = 0;
    this.srcY = 0; 
  }
  getAncho(){
    return this.wOrig / this.cols;
  }
  getAlto(){
    return this.hOrig;
  }
}

class Hero{
  constructor(x,y,anchoOrig,altoOrig,columns){
    this.posx = x;
    this.posy = y;
    this.wOrig = anchoOrig;
    this.hOrig = altoOrig;
    this.cols = columns;
    this.frame = 0;
    this.srcX = 0;
    this.srcY = 0; 
  }
  getAncho(){
    return this.wOrig / this.cols;
  }
  getAlto(){
    return this.hOrig;
  }
}
//----------------------------------------------------------
function updateFrame(char){
  char.frame = ++char.frame % char.cols;
  char.srcX = char.frame*char.getAncho();
  char.srcY = 0;
}

function drawHero(heroIN){
  if(!nivel.gameover){
    updateFrame(heroIN);
  }
  ctx.drawImage(heroImg,heroIN.srcX,heroIN.srcY,heroIN.getAncho(),heroIN.getAlto(),heroIN.posx,heroIN.posy,100,100);
  
}

function drawEnemy(enemyIN){
  if(!nivel.gameover){
    updateFrame(enemyIN);
  }
  ctx.drawImage(enemyImg,enemyIN.srcX,enemyIN.srcY,enemyIN.getAncho(),enemyIN.getAlto(),enemyIN.posx,enemyIN.posy,100,120);
}

function moveEnemy(enemyIN){
  if(enemyIN.posx < -50){
    enemyIN.posx = canvas.width + getRandomInt(0,300);
    enemyIN.posy = suelos[randomCarril()];
  }
  else{
    enemyIN.posx -= nivel.velocidad;
  }
}
//creacion de enemigos
function createEnemies() {
  for(let i = 0; i < nivel.enemigos; i++){
    let carril = suelos[randomCarril()];
    enemies[i] = new Enemy(1500+i*250,carril,nivel.velocidad,1120,256,7);
  }
}

function destroyEnemies() {
  enemies = []
}

createEnemies();
//creacion heroe
hero = new Hero(100,suelos.mid,1400,193,10);

//------------------------------------------------------------------------------------
//PANTALLA CREDITOS-------------------------------------------------------------------
let canvasCred, ctxCred;
function credits() {
  var audio = new Audio('audio/old8bit.mp3');
  audio.play();
  canvasCred = document.querySelector("#canvas-credits");
  canvasCred.addEventListener("click",volverMenu);
  ctxCred = canvasCred.getContext("2d");
  canvasCred.style.display = "block";
  let elem = [];
  let diff = 50, min = 300;
  for(let i = 0; i < 8; i++){
    let pos = min + i*diff;
    elem[i] = {
      "posx":100,
      "posy":pos,
      "image": new Image()
    }
  }
  elem[0].posx = 0;
  elem[0].image.src = "img/createdby.png";
  elem[1].image.src = "img/nahuj.png";
  elem[2].image.src = "img/lucas.png";
  elem[3].image.src = "img/nahul.png";
  elem[4].image.src = "img/rocio.png";
  elem[5].image.src = "img/eduardo.png";
  elem[6].image.src = "img/gian.png";
  elem[7].image.src = "img/diego.png";
  
  
  let idcred = setInterval(function(){
    ctxCred.clearRect(0,0,1000,400);
    for(let i = 0; i < elem.length; i++){
      ctxCred.drawImage(elem[i].image,0,0,600,40,elem[i].posx,elem[i].posy,250,25);
      elem[i].posy -= 2;
      
    }
    if(elem[7].posy < -50){
      console.log("llego");
      audio.pause();
      clearInterval(idcred);
    }
  },1000/15);
  
}

function volverMenu(){
  canvasCred.style.display = "none";
}
//------------------------------------------------------------------------------------
//bucle principal
let FPS = 15;
let id;
let audios = [new Audio('audio/tusa8bit.mp3'),new Audio('audio/goteo8bit.mp3'),new Audio('audio/takeonme8bit.mp3'),]
let audio;
function empezarGame(){
  inicial.style.display = "none";
  audio = audios[getRandomInt(0,3)];
  audio.play();
  id = setInterval(function(){
    principal();
  },1000/FPS);
  iniciar()
}

function principal(){
  
  listenerGame();
  borrarCanvas();
  movePlatform()
  drawPlatforms();
  colision(hero, enemies);
  drawHero(hero);
  for(let i = 0; i < enemies.length; i++){
    moveEnemy(enemies[i]);
    drawEnemy(enemies[i]);
  }
  drawButtons();
  upScore();
  pantalla();
}
let inicial = document.querySelector("#menu");

document.querySelector("#menuitem-game").addEventListener("click",empezarGame);
document.querySelector("#menuitem-credits").addEventListener("click",credits);

