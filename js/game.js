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
let hero = {"y":suelos.mid, "vely":0, "gravedad":2, "salto":28, "vymax":9, "saltando": false}
let enemy = {"x":500,"y":suelos.mid,"velx":0}
let buttons = {"bot":suelos.bot, "mid": suelos.mid, "top":suelos.top, "left":20}
let pantalla = {"score":0}
let platform = {"x":0, "y":0}
let nivel1 = 15;

function drawButtons(){
  ctx.drawImage(teclasImg,0,0,338,284,buttons.left,buttons.top+25,50,50);
  ctx.drawImage(teclasImg,338,0,338,284,buttons.left,buttons.mid+25,50,50);
  ctx.drawImage(teclasImg,676,0,338,284,buttons.left,buttons.bot+25,50,50);
}
//ANIMACION HERO--------------------
let anchoOrigH = 1400, altoOrigH = 193, colsH = 10;
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


//-----------------------------------------------------
//ANIMACION ENEMY--------------------------------------
let anchoOrigE = 1120, altoOrigE = 256, colsE = 7;
let anchoE = anchoOrigE / colsE;
let altoE = altoOrigE;
let srcEX = 0, srcEY = 0;


let actualFrameE = 0;
function updateFrameEnemy(){
  actualFrameE = ++actualFrameE % colsE;
  srcEX = actualFrameE*anchoE;
  srcEY = 0;
  //ctx.clearRect(100,enemy.y,100,100);
  
}

//Elige un carril random 
function randomCarril(){
  let number = Math.round(Math.random()*2);
  return carriles[number];
}

let carril = suelos[randomCarril()];
function drawEnemy(){
  updateFrameEnemy()
  ctx.drawImage(enemyImg,srcEX,srcEY,anchoE,altoE,enemy.x,carril,100,120);
}

function moveEnemy(){
  if(enemy.x < -50){
    enemy.x = canvas.width + 50;
    carril = suelos[randomCarril()];
  }
  else{
    enemy.x -= nivel1+5;
  }
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

// function gravedad(){
//   if(ninja.saltando == true){
//     if((ninja.y - ninja.vely - ninja.gravedad) > 250){
//       ninja.saltando = false;
//       ninja.vely = 0;
//       ninja.y = suelo;
//     }
//     else {
//       ninja.vely -= ninja.gravedad;
//       ninja.y -= ninja.vely;
//     }
    
//   }
// }
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
    platform.x += nivel1-5;
  }
}


//---------------------------------------------------------

//bucle principal
const FPS = 15;
setInterval(function(){
  principal();
},1000/FPS);

function principal(){
  iniciar();
  borrarCanvas();
  //gravedad();
  movePlatform()
  drawPlatforms();
  
  drawHero();
  moveEnemy();
  drawEnemy();
  drawButtons();
}