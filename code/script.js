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
  p1 = new Genome();
  p2 = new Genome();
  innovationP1 = new InnovationGenerator();
  innovationP2 = new InnovationGenerator();
  for(var i = 0; i < 3; i++){
    node = new Node("INPUT", i);
    p1.addNodeGene(node);
    p2.addNodeGene(node)
  }
  p1.addNodeGene(new Node("OUTPUT", 3));
  // p1.addNodeGene(new Node("HIDDEN", 4));

  p2.addNodeGene(new Node("OUTPUT", 3));
  p2.addNodeGene(new Node("HIDDEN", 4));
  p2.addNodeGene(new Node("HIDDEN", 5));

  p1.addConnectionGene(new Connection(0, 3, Math.random()*2-1, true, innovationP1.getInnovation()));
  p1.addConnectionGene(new Connection(1, 3, Math.random()*2-1, true, innovationP1.getInnovation()));
  p1.addConnectionGene(new Connection(2, 3, Math.random()*2-1, true, innovationP1.getInnovation()));
  // p1.addConnectionGene(new Connection(1, 4, Math.random()*2-1, true, innovationP1.getInnovation()));
  // p1.addConnectionGene(new Connection(4, 3, Math.random()*2-1, true, innovationP1.getInnovation()));
  // p1.addConnectionGene(new Connection(0, 4, Math.random()*2-1, false, innovationP1.getInnovation()));

  p2.addConnectionGene(new Connection(0, 3, Math.random()*2-1, true, innovationP2.getInnovation()));
  p2.addConnectionGene(new Connection(1, 3, Math.random()*2-1, true, innovationP2.getInnovation()));
  p2.addConnectionGene(new Connection(2, 3, Math.random()*2-1, true, innovationP2.getInnovation()));
  p2.addConnectionGene(new Connection(1, 4, Math.random()*2-1, true, innovationP2.getInnovation()));
  p2.addConnectionGene(new Connection(4, 3, Math.random()*2-1, true, innovationP2.getInnovation()));
  p2.addConnectionGene(new Connection(0, 4, Math.random()*2-1, false, innovationP2.getInnovation()));

  p2.addConnectionGene(new Connection(5, 3, Math.random()*2-1, true, innovationP2.getInnovation()));
  p2.addConnectionGene(new Connection(0, 5, Math.random()*2-1, true, innovationP2.getInnovation()));

  console.log(p1, p2);
  child = Genome.crossover(p2, p1);
  console.log(child);

}

function draw(){
  p1.render();
}

function keyPressed(){
  if(key == "n"){
    p1.addNodeMutation(innovationP1)
  }
  if(key == "w"){
    p1.addConectionMutation(innovationP1)
  }
  if(key == "m"){
    p1.mutate();
  }
}
