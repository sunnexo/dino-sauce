let gameState = new Menu();

function preload(){
  song = loadSound('audio/megaman-music.mp3');
  sJump = loadSound('audio/jump.mp3')
  sLand = loadSound('audio/land.mp3')
  sDamage = loadSound('audio/damage.mp3')
  iGameover = loadImage('graphic/gameover.png');
  iPlayerStand = loadImage('graphic/stand.png');
  iPlayerJump = loadImage('graphic/jump.png');
  iEnemy2 = loadImage('graphic/enemy2.png');
  iEnemy3 = loadImage('graphic/enemy3.png');
  iEnemy4 = loadImage('graphic/enemy4.png');
}

function setup() {
  song.play();
  song.loop(true);
  song.setVolume(0.4);
  createCanvas(1500, 600);
}


function draw() {
  gameState.update();
  gameState.render();
  if(gameState.changeGameState() != false){
    gameState = gameState.changeGameState();
  }
}

function keyPressed(){
  gameState.keyHandeler(key);
}
