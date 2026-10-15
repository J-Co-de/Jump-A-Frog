const canvas = document.getElementById("gameCanvas");
const game = document.getElementById("game");
const ctx = canvas.getContext("2d");
const fullScreenEnter = document.getElementById("fullScreenEnter");
const fullScreenExit = document.getElementById("fullScreenExit");
const smash = document.getElementById("smash");
const header = document.getElementById("gameHeader");
const footer = document.getElementById("gameFooter");

let x = 375;
let y = 300;
let isFullscreen = false;
let farX = 0;
let midX = 0;
let nearX = 0;

canvas.width = 800;
canvas.height = 575;

// ------------------ LOAD IMAGES OUTSIDE LOOP ------------------

const frogImg = new Image();
frogImg.src = "images/icons/frog.png";

const stumpImg = new Image();
stumpImg.src = "images/icons/stumped.png";

const anvilImg = new Image();
anvilImg.src = "images/icons/anvil.png";

// FIXED FOLDER NAME: forest-background
const bgFar = new Image();
bgFar.src = "images/forest-background/far-background.png";

const bgMid = new Image();
bgMid.src = "images/forest-background/forest-background.png";

const bgNear = new Image();
bgNear.src = "images/forest-background/near-background.png";

// ---------------------------------------------------------------

let anvils = [];
let frogJumpOffset = 0;
let frogMessage = "";
let frogMessageTimer = 0;

function frogReact() {
  frogJumpOffset = Math.floor(Math.random() * 5) + 1;

  const frogLines = [
    "HEY!",
    "OUCH!",
    "BRUH",
    "WHY",
    "STOP!",
    "CHILL!",
    "BRO...",
    "SERIOUSLY?",
    "STAWP FROGGY!",
    "GO AWAY!"
  ];

  frogMessage = frogLines[Math.floor(Math.random() * frogLines.length)];
  frogMessageTimer = 30;
}

// ------------------ UI BUTTONS ------------------

fullScreenEnter.addEventListener("click", () => {
  header.hidden = true;
  footer.hidden = true;
  fullScreenEnter.hidden = true;
  fullScreenExit.hidden = false;
  smash.hidden = false;
  isFullscreen = true; // background starts moving
});

fullScreenExit.addEventListener("click", () => {
  header.hidden = false;
  footer.hidden = false;
  fullScreenExit.hidden = true;
  smash.hidden = true;
  fullScreenEnter.hidden = false;
  isFullscreen = false; // background stops moving
});

// ------------------ ANVIL SPAWN ------------------

smash.addEventListener("click", () => {
  const minX = x - 110;
  const maxX = x + 50;
  const spawnX = Math.random() * (maxX - minX) + minX;

  anvils.push({
    x: spawnX,
    y: -200,
    speed: 10,
  });
});

// ------------------ GAME LOOP ------------------
// create pixelated grass texture once
const grassCanvas = document.createElement("canvas");
grassCanvas.width = 800;
grassCanvas.height = 80;
const gctx = grassCanvas.getContext("2d");

const px = 8;
const greens = ["#4caf50", "#3e8f3e", "#5cc45c", "#2f7f2f", "#6ddc6d"];

// draw pixel blocks ONCE
for (let gx = 0; gx < grassCanvas.width; gx += px) {
  for (let gy = 0; gy < grassCanvas.height; gy += px) {
    gctx.fillStyle = greens[Math.floor(Math.random() * greens.length)];
    gctx.fillRect(gx, gy, px, px);
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // PARALLAX MOVEMENT
  if (isFullscreen) {
    farX -= 0.2;
    midX -= 0.5;
    nearX -= 1.0;

    if (farX <= -canvas.width) farX = 0;
    if (midX <= -canvas.width) midX = 0;
    if (nearX <= -canvas.width) nearX = 0;
  }

  if (farX <= -canvas.width) farX = 0;
  if (midX <= -canvas.width) midX = 0;
  if (nearX <= -canvas.width) nearX = 0;

  // DRAW PARALLAX LAYERS
  ctx.drawImage(bgFar, farX, 0, canvas.width, canvas.height);
  ctx.drawImage(bgFar, farX + canvas.width, 0, canvas.width, canvas.height);

  ctx.drawImage(bgMid, midX, 0, canvas.width, canvas.height);
  ctx.drawImage(bgMid, midX + canvas.width, 0, canvas.width, canvas.height);

  ctx.drawImage(bgNear, nearX, 0, canvas.width, canvas.height);
  ctx.drawImage(bgNear, nearX + canvas.width, 0, canvas.width, canvas.height);

  // UPDATE + DRAW ANVILS
  for (let i = anvils.length - 1; i >= 0; i--) {
    const anvil = anvils[i];
    anvil.y += anvil.speed;

    if (anvil.y >= y - 50) {
      frogReact();
      anvils.splice(i, 1);
      continue;
    }

    ctx.drawImage(anvilImg, anvil.x, anvil.y, 120, 120);
  }

  // FROG SPEECH
  if (frogMessageTimer > 0) {
    const textX = x + 150; // further right
    const textY = y - 20 - frogJumpOffset;

    ctx.font = "24px Arial";
    ctx.textBaseline = "top";

    // measure text width
    const metrics = ctx.measureText(frogMessage);
    const padding = 10;
    const boxWidth = metrics.width + padding * 2;
    const boxHeight = 32;

    // background box
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(textX - padding, textY - padding, boxWidth, boxHeight);

    // text
    ctx.fillStyle = "white";
    ctx.fillText(frogMessage, textX, textY);

    frogMessageTimer--;
  }
  // draw stable pixel grass under stump
  ctx.drawImage(grassCanvas, 0, y + 200);

  ctx.drawImage(stumpImg, x - 150, y + 10, 350, 300);

  // FROG
  ctx.drawImage(frogImg, x - 25, y - frogJumpOffset, 100, 100);

  if (frogJumpOffset > 0) {
    frogJumpOffset -= 0.2;
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
