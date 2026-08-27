const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let W = 0;
let H = 0;
let score = 0;
let level = 1;
let speed = 5;
let roadMove = 0;
let playing = true;

let player = { x: 0, y: 0, w: 70, h: 95 };
let enemy = { x: 0, y: -120, w: 65, h: 90 };

let coins = [];
let blocks = [];

function resizeGame() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;

  player.x = W / 2 - player.w / 2;
  player.y = H - 135;
}

window.addEventListener("resize", resizeGame);
resizeGame();

function drawCloud(x, y, size) {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(x, y, 16 * size, 0, Math.PI * 2);
  ctx.arc(x + 22 * size, y - 7 * size, 22 * size, 0, Math.PI * 2);
  ctx.arc(x + 45 * size, y, 16 * size, 0, Math.PI * 2);
  ctx.fill();
}

function drawTree(x, y) {
  ctx.fillStyle = "#7b4b2a";
  ctx.fillRect(x - 4, y, 8, 30);

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

  ctx.fillStyle = "#71441f";
  ctx.fillRect(x + size * 0.42, y + size * 0.32, size * 0.18, size * 0.33);
}

function drawRoad() {
  let roadTop = H * 0.28;
  let topWidth = Math.min(W * 0.32, 360);
  let bottomWidth = Math.min(W * 1.15, 1050);

  let leftTop = W / 2 - topWidth / 2;
  let rightTop = W / 2 + topWidth / 2;
  let leftBottom = W / 2 - bottomWidth / 2;
  let rightBottom = W / 2 + bottomWidth / 2;

  ctx.fillStyle = "#68c7eb";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#82cf58";
  ctx.fillRect(0, roadTop, W, H);

  drawCloud(70, 135, 1);
  drawCloud(W - 125, 170, 0.8);

  drawHouse(35, H * 0.42, 90);
  drawHouse(W - 125, H * 0.38, 95);

  ctx.fillStyle = "#555b60";
  ctx.beginPath();
  ctx.moveTo(leftTop, roadTop);
  ctx.lineTo(rightTop, roadTop);
  ctx.lineTo(rightBottom, H);
  ctx.lineTo(leftBottom, H);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#222";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(leftTop, roadTop);
  ctx.lineTo(leftBottom, H);
  ctx.moveTo(rightTop, roadTop);
  ctx.lineTo(rightBottom, H);
  ctx.stroke();

  ctx.fillStyle = "#ffe13d";
  for (let y = H * 0.34 + roadMove; y < H; y += 110) {
    ctx.fillRect(W / 2 - 6, y, 12, 55);
  }

  for (let y = H * 0.36; y < H; y += 145) {
    let part = (y - roadTop) / (H - roadTop);
    let leftX = leftTop + (leftBottom - leftTop) * part;
    let rightX = rightTop + (rightBottom - rightTop) * part;

    drawTree(leftX - 42, y);
    drawTree(rightX + 42, y + 30);
  }
}

function drawCar(car, color, name) {
  ctx.fillStyle = "#222";
  ctx.fillRect(car.x - 5, car.y + 18, 10, 25);
  ctx.fillRect(car.x + car.w - 5, car.y + 18, 10, 25);
  ctx.fillRect(car.x - 5, car.y + 65, 10, 25);
  ctx.fillRect(car.x + car.w - 5, car.y + 65, 10, 25);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(car.x, car.y, car.w, car.h, 12);
  ctx.fill();

  ctx.strokeStyle = "#222";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#ffc9a4";
  ctx.beginPath();
  ctx.arc(car.x + car.w / 2, car.y + 30, 21, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#222";

  if (name === "motu") {
    ctx.beginPath();
    ctx.arc(car.x + car.w / 2 - 10, car.y + 42, 11, 0, Math.PI * 2);
    ctx.arc(car.x + car.w / 2 + 10, car.y + 42, 11, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.strokeRect(car.x + car.w / 2 - 17, car.y + 22, 12, 10);
    ctx.strokeRect(car.x + car.w / 2 + 5, car.y + 22, 12, 10);
  }

  ctx.fillStyle = "#a9e7fa";
  ctx.fillRect(car.x + 9, car.y + car.h - 27, car.w - 18, 13);
}

function randomX() {
  return W * 0.32 + Math.random() * W * 0.36;
}

function touching(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function addItems() {
  coins.push({ x: randomX(), y: -20 });

  if (Math.random() < 0.35) {
    blocks.push({
      x: randomX(),
      y: -70,
      w: 45,
      h: 65
    });
  }
}

function updateGame() {
  roadMove += speed;

  if (roadMove > 110) {
    roadMove = 0;
  }

  enemy.y += speed;

  if (enemy.y > H + 100) {
    enemy.y = -120;
    enemy.x = randomX();
  }

  if (Math.random() < 0.025) {
    addItems();
  }

  coins.forEach(function(coin) {
    coin.y += speed;
  });

  blocks.forEach(function(block) {
    block.y += speed;
  });

  coins = coins.filter(function(coin) {
    if (coin.y > H) {
      return false;
    }

    let coinBox = {
      x: coin.x - 17,
      y: coin.y - 17,
      w: 34,
      h: 34
    };

    if (touching(player, coinBox)) {
      score++;
      document.getElementById("score").textContent = score;

      if (score % 5 === 0) {
        level++;
        speed += 0.5;
        document.getElementById("level").textContent = level;
      }

      return false;
    }

    return true;
  });

  blocks = blocks.filter(function(block) {
    if (block.y > H) {
      return false;
    }

    if (touching(player, block)) {
      gameOver();
    }

    return true;
  });

  if (touching(player, enemy)) {
    gameOver();
  }
}

function gameOver() {
  playing = false;
  document.getElementById("over").style.display = "flex";
}

function drawItems() {
  blocks.forEach(function(block) {
    ctx.fillStyle = "#f47735";
    ctx.beginPath();
    ctx.moveTo(block.x, block.y - 30);
    ctx.lineTo(block.x - 22, block.y + 30);
    ctx.lineTo(block.x + 22, block.y + 30);
    ctx.closePath();
    ctx.fill();
  });

  coins.forEach(function(coin) {
    ctx.fillStyle = "#ffc21f";
    ctx.beginPath();
    ctx.arc(coin.x, coin.y, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#fff07a";
    ctx.lineWidth = 3;
    ctx.stroke();
  });
}

function gameLoop() {
  if (!playing) {
    return;
  }

  drawRoad();
  updateGame();
  drawItems();

  drawCar(enemy, "#8b57d5", "patlu");
  drawCar(player, "#e94138", "motu");

  requestAnimationFrame(gameLoop);
}

function movePlayer(amount) {
  player.x += amount;

  if (player.x < 0) {
    player.x = 0;
  }

  if (player.x > W - player.w) {
    player.x = W - player.w;
  }
}

window.addEventListener("keydown", function(event) {
  if (event.key === "ArrowLeft") {
    movePlayer(-35);
  }

  if (event.key === "ArrowRight") {
    movePlayer(35);
  }

  if (event.key === "ArrowUp" || event.key === " ") {
    jump();
  }
});

document.getElementById("left").onclick = function() {
  movePlayer(-35);
};

document.getElementById("right").onclick = function() {
  movePlayer(35);
};

document.getElementById("jump").onclick = jump;

function jump() {
  let oldY = player.y;
  player.y -= 45;

  setTimeout(function() {
    player.y = oldY;
  }, 180);
}

enemy.x = randomX();
gameLoop();
