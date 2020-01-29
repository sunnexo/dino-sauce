let dino;
let cactuses = [];
let highScore = 0;

function preload(){
  song = loadSound('audio/megaman-music.mp3');
  sJump = loadSound('audio/jump.mp3')
  sLand = loadSound('audio/land.mp3')
  sDamage = loadSound('audio/damage.mp3')
  iGameover = loadImage('graphic/gameover.png');
}

function setup() {
  song.play();
  song.setLoop(true);
  song.setVolume(0.4);
  createCanvas(1200, 500);
  reset();
}

function reset(){
  dino = new Dino();
  cactuses = [];
  cactuses.push(new Cactus(width+0));
  cactuses.push(new Cactus(width+500));
  cactuses.push(new Cactus(width+1000));
  cactuses.push(new Cactus(width+1500));
}

function draw() {
  if(dino.run){
    background(0);
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
    dino.update();
    for(var i = 0; i < cactuses.length; i++){
      cactus = cactuses[i]
      cactus.move();
      cactus.collision(dino);
    }
  }
}

function keyPressed(){
  if(key == " "){
    dino.jump();
  }
  if(key == " " && !dino.run){
    console.log("test")
    reset()
  }
}
