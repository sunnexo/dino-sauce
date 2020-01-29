let dino;
let cactus = [];


function setup() {
  createCanvas(600,600);
  dino = new Dino();
}


function draw() {
  dino.update();
  dino.render();
}


function keyPressed(){
  if(key = " "){
    dino.jump();
  }
}
