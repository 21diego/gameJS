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
  heroImg.src = "img/hero.png";
  platImg.src = "img/plattest.png";
  teclasImg.src = "img/teclas.png"
}

let carriles = ["mid","top","bot"];
let suelos = {"bot":280, "mid": 170, "top":60};
let hero;
let enemy = {"x":Math.round(Math.random()*1200),"y":suelos.mid,"velx":0}
let enemies = [];
let buttons = {"bot":suelos.bot, "mid": suelos.mid, "top":suelos.top, "left":20}
let pantalla = {"score":0}
let platform = {"x":0, "y":0}
let nivel = {"velocidad": 15, "enemigos":3, "gameover":false};

function drawButtons(){
  ctx.drawImage(teclasImg,0,0,338,284,buttons.left,buttons.top+25,50,50);
  ctx.drawImage(teclasImg,338,0,338,284,buttons.left,buttons.mid+25,50,50);
  ctx.drawImage(teclasImg,676,0,338,284,buttons.left,buttons.bot+25,50,50);
}
//ANIMACION HERO--------------------

function mover(pos){
  if(pos == "bot"){
    hero.posy = buttons.bot;
  }else if(pos == "mid"){
    hero.posy = buttons.mid;
  }else if(pos == "top"){
    hero.posy = buttons.top;
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
    if(hero.posy == actualEnemy.posy && hero.posx+70 > actualEnemy.posx){
      console.log("chocaron");
      nivel.velocidad = 0;
      nivel.gameover = true;
    }
  }
  
}
//---------------------------------------------------------

//bucle principal
let FPS = 15;
let termino = false;
function ciclo(cond) {
  if(!cond){
    setInterval(function(){
      principal();
    },1000/FPS)
  } 
}


ciclo(termino);
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
for(let i = 0; i < nivel.enemigos; i++){
  let carril = suelos[randomCarril()];
  enemies[i] = new Enemy(1500+i*250,carril,nivel.velocidad,1120,256,7);
}
//creacion heroe
hero = new Hero(100,suelos.mid,1400,193,10);

function principal(){
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
}