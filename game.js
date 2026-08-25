const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let player = {
  x: 180,
  y: 490,
  w: 55,
  h: 75
};

let badGuy = {
  x: 100,
  y: -100,
  w: 55,
  h: 75
};

let score = 0;
let level = 1;
let speed = 4;
let playing = true;
let roadMove = 0;

function drawRoad(){
  ctx.fillStyle = "#7bd35a";
  ctx.fillRect(0,0,400,600);

  // little trees
  for(let y=40;y<600;y+=120){
    ctx.fillStyle="#7b4b2a";
    ctx.fillRect(25,y,8,35);
    ctx.fillStyle="#2d9b42";
    ctx.beginPath();
    ctx.arc(29,y,25,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle="#7b4b2a";
    ctx.fillRect(365,y+40,8,35);
    ctx.fillStyle="#2d9b42";
    ctx.beginPath();
    ctx.arc(369,y+40,25,0,Math.PI*2);
    ctx.fill();
  }

  ctx.fillStyle="#555";
  ctx.fillRect(65,0,270,600);

  ctx.fillStyle="#eee";
  ctx.fillRect(62,0,5,600);
  ctx.fillRect(333,0,5,600);

  ctx.fillStyle="white";

  for(let y=-70+roadMove;y<600;y+=90){
    ctx.fillRect(198,y,6,45);
  }
}

function drawVehicle(a,color,name){
  // wheels
  ctx.fillStyle="#111";
  ctx.fillRect(a.x-5,a.y+12,10,18);
  ctx.fillRect(a.x+a.w-5,a.y+12,10,18);
  ctx.fillRect(a.x-5,a.y+48,10,18);
  ctx.fillRect(a.x+a.w-5,a.y+48,10,18);

  // body
  ctx.fillStyle=color;
  ctx.fillRect(a.x,a.y,a.w,a.h);

  // window
  ctx.fillStyle="#9eeaff";
  ctx.fillRect(a.x+8,a.y+10,a.w-16,18);

  // lights
  ctx.fillStyle="#ffe55c";
  ctx.fillRect(a.x+5,a.y+3,9,7);
  ctx.fillRect(a.x+a.w-14,a.y+3,9,7);

  // character name
  ctx.fillStyle="#111";
  ctx.font="bold 10px Arial";
  ctx.textAlign="center";
  ctx.fillText(name,a.x+a.w/2,a.y+50);
}

function touch(a,b){
  if(
    a.x < b.x+b.w &&
    a.x+a.w > b.x &&
    a.y < b.y+b.h &&
    a.y+a.h > b.y
  ){
    return true;
  }

  return false;
}

function gameLoop(){
  if(!playing) return;

  roadMove += speed;
  if(roadMove > 90) roadMove = 0;

  drawRoad();

  badGuy.y += speed;

  if(badGuy.y > 650){
    badGuy.y = -100;
    badGuy.x = 75 + Math.random()*200;

    score = score + 1;
    document.getElementById("score").textContent = score;

    if(score % 5 == 0){
      level = level + 1;
      speed = speed + 0.5;
      document.getElementById("level").textContent = level;
    }
  }

  // simple original cartoon-style labels, not official artwork
  drawVehicle(player,"#e74c3c","MOTU");
  drawVehicle(badGuy,"#3498db","PATLU");

  if(touch(player,badGuy)){
    playing = false;
    document.getElementById("over").style.display = "flex";
  }

  requestAnimationFrame(gameLoop);
}

document.onkeydown = function(e){
  if(e.key == "ArrowLeft"){
    player.x = player.x - 25;
  }

  if(e.key == "ArrowRight"){
    player.x = player.x + 25;
  }

  if(player.x < 75) player.x = 75;
  if(player.x > 280) player.x = 280;
};

canvas.ontouchmove = function(e){
  e.preventDefault();

  let box = canvas.getBoundingClientRect();
  let finger = e.touches[0].clientX;

  player.x = finger - box.left - 25;

  if(player.x < 75) player.x = 75;
  if(player.x > 280) player.x = 280;
};

gameLoop();
