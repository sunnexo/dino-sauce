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
  createCanvas(displayWidth-20, displayHeight-200);
}

function reset(){
  game = new Game(true);
}

function draw() {
  if(!game.isDeath()){
    game.update()
  }
}

function keyPressed(){
  game.dino.score = round(game.dino.score)
  if(key == " "){
    game.jump();
  }
  if(key == " " && game.isDeath()){
    console.log(game.getInputs())
    reset()
  }
}
