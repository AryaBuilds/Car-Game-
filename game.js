var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var W = window.innerWidth;
var H = window.innerHeight;
var score = 0;
var level = 1;
var speed = 5;
var roadY = 0;
var isPlaying = true;

canvas.width = W;
canvas.height = H;

var player = {
  x: W / 2 - 35,
  y: H - 135,
  w: 70,
  h: 95
};

var enemy = {
  x: 200,
  y: -120,
  w: 65,
  h: 90
};

var coins = [];
var blocks = [];

window.onresize = function () {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
  player.x = W / 2 - 35;
  player.y = H - 135;
}

function drawCloud(x, y, size) {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(x, y, 16 * size, 0, Math.PI * 2);
  ctx.arc(x + 22 * size, y - 7 * size, 22 * size, 0, Math.PI * 2);
  ctx.arc(x + 45 * size, y, 16 * size, 0, Math.PI * 2);
  ctx.fill();
}

function drawTree(x, y) {
  // tree ka tna (trunk)
  ctx.fillStyle = "#7b4b2a";
  ctx.fillRect(x - 4, y, 8, 30);

  // green patto wala part
  ctx.fillStyle = "#39a34a";
  ctx.beginPath();
  ctx.arc(x, y - 10, 22, 0, Math.PI * 2);
  ctx.arc(x - 15, y, 16, 0, Math.PI * 2);
  ctx.arc(x + 15, y, 16, 0, Math.PI * 2);
  ctx.fill();
}

function drawHouse(x, y, size) {
  ctx.fillStyle = "#f4cf72";
  ctx.fillRect(x, y, size, size * 0.65);

  ctx.fillStyle = "#d95545";
  ctx.beginPath();
  ctx.moveTo(x - 7, y);
  ctx.lineTo(x + size / 2, y - size * 0.28);
  ctx.lineTo(x + size + 7, y);
  ctx.fill();

  // darwaza
  ctx.fillStyle = "#71441f";
  ctx.fillRect(x + size * 0.42, y + size * 0.32, size * 0.18, size * 0.33);
}

function drawBackground() {
  var roadTop = H * 0.28;
  var topW = W * 0.32;
  if (topW > 360) {
    topW = 360;
  }
  var botW = W * 1.15;
  if (botW > 1050) {
    botW = 1050;
  }

  var lTop = W / 2 - topW / 2;
  var rTop = W / 2 + topW / 2;
  var lBot = W / 2 - botW / 2;
  var rBot = W / 2 + botW / 2;

  ctx.fillStyle = "#68c7eb";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#82cf58";
  ctx.fillRect(0, roadTop, W, H);

  drawCloud(70, 135, 1);
  drawCloud(W - 125, 170, 0.8);

  drawHouse(35, H * 0.42, 90);
  drawHouse(W - 125, H * 0.38, 95);

  // ab road bnao
  ctx.fillStyle = "#555b60";
  ctx.beginPath();
  ctx.moveTo(lTop, roadTop);
  ctx.lineTo(rTop, roadTop);
  ctx.lineTo(rBot, H);
  ctx.lineTo(lBot, H);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#222";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(lTop, roadTop);
  ctx.lineTo(lBot, H);
  ctx.moveTo(rTop, roadTop);
  ctx.lineTo(rBot, H);
  ctx.stroke();

  // beech ki yellow line
  ctx.fillStyle = "#ffe13d";
  for (var y = H * 0.34 + roadY; y < H; y = y + 110) {
    ctx.fillRect(W / 2 - 6, y, 12, 55);
  }

  for (var y2 = H * 0.36; y2 < H; y2 = y2 + 145) {
    var part = (y2 - roadTop) / (H - roadTop);
    var leftX = lTop + (lBot - lTop) * part;
    var rightX = rTop + (rBot - rTop) * part;
    drawTree(leftX - 42, y2);
    drawTree(rightX + 42, y2 + 30);
  }
}

function drawCar(c, color, isMotu) {
  ctx.fillStyle = "#222";
  ctx.fillRect(c.x - 5, c.y + 18, 10, 25);
  ctx.fillRect(c.x + c.w - 5, c.y + 18, 10, 25);
  ctx.fillRect(c.x - 5, c.y + 65, 10, 25);
  ctx.fillRect(c.x + c.w - 5, c.y + 65, 10, 25);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(c.x, c.y, c.w, c.h, 12);
  ctx.fill();
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 3;
  ctx.stroke();

  // face wala circle
  ctx.fillStyle = "#ffc9a4";
  ctx.beginPath();
  ctx.arc(c.x + c.w / 2, c.y + 30, 21, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#222";
  if (isMotu == true) {
    ctx.beginPath();
    ctx.arc(c.x + c.w / 2 - 10, c.y + 42, 11, 0, Math.PI * 2);
    ctx.arc(c.x + c.w / 2 + 10, c.y + 42, 11, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.strokeRect(c.x + c.w / 2 - 17, c.y + 22, 12, 10);
    ctx.strokeRect(c.x + c.w / 2 + 5, c.y + 22, 12, 10);
  }

  ctx.fillStyle = "#a9e7fa";
  ctx.fillRect(c.x + 9, c.y + c.h - 27, c.w - 18, 13);
}

function getRandomX() {
  return W * 0.32 + Math.random() * W * 0.36;
}

function isHit(a, b) {
  if (a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y) {
    return true;
  }
  return false;
}

function spawnStuff() {
  coins.push({ x: getRandomX(), y: -20 });

  // kabhi kabhi obstacle bhi daal do
  if (Math.random() < 0.35) {
    blocks.push({ x: getRandomX(), y: -70, w: 45, h: 65 });
  }
}

function update() {
  roadY = roadY + speed;
  if (roadY > 110) {
    roadY = 0;
  }

  enemy.y = enemy.y + speed;
  if (enemy.y > H + 100) {
    enemy.y = -120;
    enemy.x = getRandomX();
  }

  if (Math.random() < 0.025) {
    spawnStuff();
  }

  for (var i = 0; i < coins.length; i++) {
    coins[i].y += speed;
  }
  for (var j = 0; j < blocks.length; j++) {
    blocks[j].y += speed;
  }

  // coin collect krna
  var newCoins = [];
  for (var k = 0; k < coins.length; k++) {
    var coin = coins[k];
    if (coin.y > H) {
      continue;
    }
    var cbox = { x: coin.x - 17, y: coin.y - 17, w: 34, h: 34 };
    if (isHit(player, cbox)) {
      score = score + 1;
      document.getElementById("score").innerHTML = score;
      if (score % 5 == 0) {
        level++;
        speed = speed + 0.5;
        document.getElementById("level").innerHTML = level;
      }
    } else {
      newCoins.push(coin);
    }
  }
  coins = newCoins;

  var newBlocks = [];
  for (var m = 0; m < blocks.length; m++) {
    var b = blocks[m];
    if (b.y > H) {
      continue;
    }
    if (isHit(player, b)) {
      endGame();
    }
    newBlocks.push(b);
  }
  blocks = newBlocks;

  if (isHit(player, enemy)) {
    endGame();
  }
}

function endGame() {
  isPlaying = false;
  document.getElementById("over").style.display = "flex";
  document.getElementById("final-score").innerHTML = score;
}

function drawStuff() {
  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i];
    ctx.fillStyle = "#f47735";
    ctx.beginPath();
    ctx.moveTo(b.x, b.y - 30);
    ctx.lineTo(b.x - 22, b.y + 30);
    ctx.lineTo(b.x + 22, b.y + 30);
    ctx.closePath();
    ctx.fill();
  }

  for (var j = 0; j < coins.length; j++) {
    var c = coins[j];
    ctx.fillStyle = "#ffc21f";
    ctx.beginPath();
    ctx.arc(c.x, c.y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff07a";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

function loop() {
  if (!isPlaying) {
    return;
  }
  drawBackground();
  update();
  drawStuff();

  drawCar(enemy, "#8b57d5", false);
  drawCar(player, "#e94138", true);

  requestAnimationFrame(loop);
}

function move(amt) {
  player.x = player.x + amt;
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x > W - player.w) {
    player.x = W - player.w;
  }
}

document.addEventListener("keydown", function (e) {
  if (e.key == "ArrowLeft") {
    move(-35);
  }
  if (e.key == "ArrowRight") {
    move(35);
  }
  if (e.key == "ArrowUp" || e.key == " ") {
    doJump();
  }
});

document.getElementById("left").onclick = function () {
  move(-35);
};
document.getElementById("right").onclick = function () {
  move(35);
};
document.getElementById("jump").onclick = function () {
  doJump();
};

function doJump() {
  var oldY = player.y;
  player.y = player.y - 45;
  setTimeout(function () {
    player.y = oldY;
  }, 180);
}

enemy.x = getRandomX();
loop();
