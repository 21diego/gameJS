document.addEventListener("keydown",function(evento){
  if(evento.keyCode == 65 || evento.keyCode == 97){
    mover("mid");
  }
  else if(evento.keyCode == 81 || evento.keyCode == 113){
    mover("top");
  }
  else if(evento.keyCode == 90 || evento.keyCode == 122){
    mover("bot");
  }
});



//----------------------------------------------------
//CANVAS----------------------------------------------
let canwidth = 1000;
let canheight = 400;

let canvas, context;

function iniciar(){
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  cargarImages();
  borrarCanvas()
}

function borrarCanvas(){
  canvas.width = canwidth;
  canvas.height = canheight;
}



//carga de imagenes e inicializacion---------------------
let ninjaImg, enemyImg, buttonImg, heroImg, platImg, teclasImg;

function cargarImages(){
  enemyImg = new Image();
  buttonImg = new Image();
  heroImg = new Image();
  platImg = new Image();
  teclasImg = new Image();
  enemyImg.src = "img/villain2.png";
  buttonImg.src = "img/button.png";
  heroImg.src = "img/hero2.png";
  platImg.src = "img/plattest.png";
  teclasImg.src = "img/teclas.png"
}

let carriles = ["mid","top","bot"];
let suelos = {"bot":280, "mid": 170, "top":60};
let hero = {"y":suelos.mid, "vely":0, "gravedad":2, "salto":28, "vymax":9, "saltando": false}
let enemy = {"x":Math.round(Math.random()*1200),"y":suelos.mid,"velx":0}
let enemies = [];
let buttons = {"bot":suelos.bot, "mid": suelos.mid, "top":suelos.top, "left":20}
let pantalla = {"score":0}
let platform = {"x":0, "y":0}
let nivel = {"velocidad": 15, "enemigos":3};

function drawButtons(){
  ctx.drawImage(teclasImg,0,0,338,284,buttons.left,buttons.top+25,50,50);
  ctx.drawImage(teclasImg,338,0,338,284,buttons.left,buttons.mid+25,50,50);
  ctx.drawImage(teclasImg,676,0,338,284,buttons.left,buttons.bot+25,50,50);
}
//ANIMACION HERO--------------------
let anchoOrigH = 2800, altoOrigH = 193, colsH = 20;
let anchoH = anchoOrigH / colsH;
let altoH = altoOrigH;
let srcHX = 0, srcHY = 0;


let actualFrameH = 0;
function updateFrameHero(){
  actualFrameH = ++actualFrameH % colsH;
  srcHX = actualFrameH*anchoH;
  srcHY = 0;
}

function drawHero(){
  updateFrameHero();
  ctx.drawImage(heroImg,srcHX,srcHY,anchoH,altoH,100,hero.y,100,100);
}
function mover(pos){
  if(pos == "bot"){
    hero.y = buttons.bot;
  }else if(pos == "mid"){
    hero.y = buttons.mid;
  }else if(pos == "top"){
    hero.y = buttons.top;
  }
}

//-----------------------------------------------------


//ANIMACION ENEMY--------------------------------------

//Elige un carril random 
function randomCarril(){
  let number = Math.round(Math.random()*2);
  return carriles[number];
}

//DRAW PLATFOMRS-------------------------------------------
function drawPlatforms(){
  ctx.drawImage(platImg,platform.x,0,800,180,-10,suelos.mid+70,1200,70);
  ctx.drawImage(platImg,platform.x,0,800,180,-10,suelos.top+70,1200,70);
  ctx.drawImage(platImg,platform.x,0,800,180,-10,suelos.bot+70,1200,70);
}

function movePlatform(){
  if(platform.x > 200){
    platform.x = 0;
  }
  else{
    platform.x += nivel.velocidad-5;
  }
}


//---------------------------------------------------------

//bucle principal
const FPS = 15;
setInterval(function(){
  principal();
},1000/FPS);

iniciar()

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
//----------------------------------------------------------
function updateFrameEnemy2(enemyIN){
  enemyIN.frame = ++enemyIN.frame % enemyIN.cols;
  enemyIN.srcX = enemyIN.frame*enemyIN.getAncho();
  enemyIN.srcY = 0;
}

function drawEnemy2(enemyIN){
  updateFrameEnemy2(enemyIN);
  ctx.drawImage(enemyImg,enemyIN.srcX,enemyIN.srcY,enemyIN.getAncho(),enemyIN.getAlto(),enemyIN.posx,enemyIN.posy,100,120);
}

function moveEnemy2(enemyIN){
  if(enemyIN.posx < -50){
    enemyIN.posx = canvas.width + getRandomInt(0,300);
    enemyIN.posy = suelos[randomCarril()];
  }
  else{
    enemyIN.posx -= nivel.velocidad+5;
  }
}
//creacion de enemigos
for(let i = 0; i < nivel.enemigos; i++){
  let carril = suelos[randomCarril()];
  enemies[i] = new Enemy(getRandomInt(1000,1600),carril,nivel.velocidad,1120,256,7);
}

function principal(){
  borrarCanvas();
  movePlatform()
  drawPlatforms();
  drawHero();
  for(let i = 0; i < enemies.length; i++){
    moveEnemy2(enemies[i]);
    drawEnemy2(enemies[i]);
  }
  drawButtons();
}