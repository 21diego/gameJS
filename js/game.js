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
let canwidth = 700;
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

let ninjaImg, enemyImg, buttonImg, heroImg;

function cargarImages(){
  enemyImg = new Image();
  buttonImg = new Image();
  heroImg = new Image();
  enemyImg.src = "img/villain.png";
  buttonImg.src = "img/button.png";
  heroImg.src = "img/hero2.png";
}

let suelos = {"bot":280, "mid": 180, "top":80};
let hero = {"y":suelos.mid, "vely":0, "gravedad":2, "salto":28, "vymax":9, "saltando": false}
let enemy = {"x":500,"y":suelos.mid,"velx":0}
let buttons = {"bot":suelos.bot, "mid": suelos.mid, "top":suelos.top, "left":20}
let pantalla = {"score":0}
let nivel1 = 5;

function drawButtons(){
  ctx.drawImage(buttonImg,0,0,300,300,buttons.left,buttons.top,50,50);
  ctx.drawImage(buttonImg,0,0,300,300,buttons.left,buttons.mid,50,50);
  ctx.drawImage(buttonImg,0,0,300,300,buttons.left,buttons.bot,50,50);
  ctx.font = "30px Arial";
  ctx.fillText("Q", buttons.left, buttons.top);
  ctx.fillText("A", buttons.left, buttons.mid);
  ctx.fillText("Z", buttons.left, buttons.bot);
}
//ANIMACION HERO--------------------
let anchoOrig = 2800, altoOrig = 193, cols = 20;
let ancho = anchoOrig / cols;
let alto = altoOrig;
let sourceX = 0, sourceY = 0;

let actualFrame = 0;

function updateFrame(){
  actualFrame = ++actualFrame % cols;
  sourceX = actualFrame*ancho;
  sourceY = 0;
  ctx.clearRect(100,hero.y,100,100);
  
}

function drawHero(){
  updateFrame();
  ctx.drawImage(heroImg,sourceX,sourceY,ancho,alto,100,hero.y,100,100);
}


//----------------------------------

function drawEnemy(){
  
  ctx.drawImage(enemyImg,0,0,600,500,enemy.x,enemy.y,100,90);
}

function moveEnemy(){
  if(enemy.x < -50){
    enemy.x = canvas.width + 50;
  }
  else{
    enemy.x -= nivel1;
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


//bucle principal
const FPS = 15;
setInterval(function(){
  principal();
},1000/FPS);

function principal(){
  iniciar();
  borrarCanvas();
  //gravedad();
  drawButtons();
  drawHero();
  moveEnemy();
  drawEnemy();
}