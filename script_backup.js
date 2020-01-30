let dino;
let cactuses = [];
let highScore = 0;
let game;

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
  megaman_bg = loadImage('graphic/megaman-bg.png');
}

function setup() {
  song.play();
  song.setLoop(true);
  song.setVolume(0.4);
  // createCanvas(displayWidth-20, displayHeight-200);
  createCanvas(1500, 600);
  // megaman_bg.resize(width, height);
  reset();
}

function reset(){
  game = new Game(true);
}

function draw() {
  this.keyPressed()
  if(!game.isDeath()){
    game.update()
  }
}

function keyPressed(){
  console.log(game.dino.score)
  game.dino.score = round(game.dino.score)
  if(key == " "){
    game.jump();
  }
  if(key == " " && game.isDeath()){
    console.log(game.getInputs())
    reset()
  }
}
