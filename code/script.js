let gameState;
let sound = false;

function preload() {
  if (sound) {
    song = loadSound("audio/megaman-music.mp3");
    sJump = loadSound("audio/jump.mp3");
    sLand = loadSound("audio/land.mp3");
    sDamage = loadSound("audio/damage.mp3");
  }
  iGameover = loadImage("graphic/gameover.png");
  iPlayerStand = loadImage("graphic/stand.png");
  iPlayerJump = loadImage("graphic/jump.png");
  iEnemy2 = loadImage("graphic/enemy2.png");
  iEnemy3 = loadImage("graphic/enemy3.png");
  iEnemy4 = loadImage("graphic/enemy4.png");
  megaman_bg = loadImage("graphic/megaman-bg.png");
}

function setup() {
  if (sound) {
    song.setLoop(true);
    song.setVolume(0.4);
    song.play();
  }
  displayHeight -= 110;
  displayWidth -= 0;
  // displayHeight -= 287
  // displayWidth -= 307
  // let w = displayHeight * (397/223);
  // let h = displayWidth * (223/397);
  // if(w<displayWidth){
  //   createCanvas(w,displayHeight)
  // }else{
  //   createCanvas(displayHeight * (397/223), h)
  // }
  createCanvas(displayWidth, displayHeight);
  // createCanvas(1229,578)
  gameState = new Menu();
}

function draw() {
  gameState.update();
  gameState.render();
  if (gameState.changeGameState() != false) {
    gameState = gameState.changeGameState();
  }
}

function keyPressed() {
  gameState.keyHandeler(key);
}
