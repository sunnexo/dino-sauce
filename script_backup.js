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
}

function setup() {
  song.play();
  song.loop(true);
  song.setVolume(0.4);
  createCanvas(displayWidth-20, displayHeight-200);
  // createCanvas(1200, 500);
  reset();
}

function reset(){
  game = new Game(true);
  // dino = new Dino();
  // cactuses = [];
  // cactuses.push(new Cactus(width+0));
  // cactuses.push(new Cactus(width+(width/4)*1));
  // cactuses.push(new Cactus(width+(width/4)*3));
  // cactuses.push(new Cactus(width*2));

}

function draw() {
  if(!game.isDeath()){
    game.update()
  }
  // if(dino.run){
  //   background(200);
  //   push()
  //   fill(255)
  //   textSize(30);
  //
  //   text("Score: "+round(dino.score), 40, 40)
  //   pop()
  //   dino.render();
  //   for(var i = 0; i < cactuses.length; i++){
  //     cactus = cactuses[i]
  //     cactus.render();
  //   }
  //   for(var i = 0; i < cactuses.length; i++){
  //     cactus = cactuses[i]
  //     cactus.move();
  //     cactus.collision(dino);
  //   }
  //   dino.update();
  // }
}

function keyPressed(){
  // dino.score = round(dino.score)
  console.log(game.dino.score)
  game.dino.score = round(game.dino.score)
  if(key == " "){
    // dino.jump();
    game.jump();
  }
  if(key == " " && game.isDeath()){
    console.log(game.getInputs())
    reset()
  }
}
