// let gameState;
// let sound = false;
//
// function preload(){
//   if(sound){
//     song = loadSound('audio/megaman-music.mp3');
//     sJump = loadSound('audio/jump.mp3')
//     sLand = loadSound('audio/land.mp3')
//     sDamage = loadSound('audio/damage.mp3')
//   }
//   iGameover = loadImage('graphic/gameover.png');
//   iPlayerStand = loadImage('graphic/stand.png');
//   iPlayerJump = loadImage('graphic/jump.png');
//   iEnemy2 = loadImage('graphic/enemy2.png');
//   iEnemy3 = loadImage('graphic/enemy3.png');
//   iEnemy4 = loadImage('graphic/enemy4.png');
//   megaman_bg = loadImage('graphic/megaman-bg.png');
//
// }
//
// function setup() {
//   if(sound){
//     song.setLoop(true);
//     song.setVolume(0.4);
//     song.play();
//   }
//   displayHeight -= 143
//   displayWidth -= 0
//   let w = displayHeight * (397/223);
//   let h = displayWidth * (223/397);
//   // if(w<displayWidth){
//   //   createCanvas(w,displayHeight)
//   // }else{
//   //   createCanvas(displayHeight * (397/223), h)
//   // }
//   createCanvas(displayWidth, displayHeight)
//   gameState = new Menu()
// }
//
//
// function draw() {
//   gameState.update();
//   gameState.render();
//   if(gameState.changeGameState() != false){
//     gameState = gameState.changeGameState();
//   }
// }
//
// function keyPressed(){
//   gameState.keyHandeler(key);
// }

let p1;
let p2;
let child;
let innovationP1;
let innovationP2;
function setup(){
  createCanvas(500, 500);
  p1 = new Genome().init(2, 1);
  p2 = new Genome().init(2, 1);

  child = Genome.crossover(p2, p1);

  console.log(Genome.compatibilityDistance(p1, p2, 1, 1, 1));


}

function draw(){
  p1.render();
}

function keyPressed(){
  if(key == "n"){
    p1.addNodeMutation()
    console.log(Genome.compatibilityDistance(p1, p2, 1, 1, 1));
  }
  if(key == "w"){
    p1.addConectionMutation()
    console.log(Genome.compatibilityDistance(p1, p2, 1, 1, 1))
  }
  if(key == "m"){
    p1.mutate();
    console.log(Genome.compatibilityDistance(p1, p2, 1, 1, 1))
  }
}
