let dino;
let cactuses = [];
let highScore = 0;

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
  song.setLoop(true);
  song.setVolume(0.4);
  createCanvas(displayWidth, displayHeight);
  // createCanvas(1200, 500);
  reset();
}

function reset(){
  dino = new Dino();
  cactuses = [];
  cactuses.push(new Cactus(width+0));
  cactuses.push(new Cactus(width+(width/4)*1));
  cactuses.push(new Cactus(width+(width/4)*3));
  cactuses.push(new Cactus(width*2));
}

function draw() {
  if(dino.run){
    background(200);
    push()
    fill(255)
    textSize(30);

    text("Score: "+round(dino.score), 40, 40)
    pop()
    dino.render();
    for(var i = 0; i < cactuses.length; i++){
      cactus = cactuses[i]
      cactus.render();
    }
    for(var i = 0; i < cactuses.length; i++){
      cactus = cactuses[i]
      cactus.move();
      cactus.collision(dino);
    }
    dino.update();
  }
}

function keyPressed(){
  dino.score = round(dino.score)
  if(key == " "){
    dino.jump();
  }
  if(key == " " && !dino.run){
    console.log("test")
    reset()
  }
}
