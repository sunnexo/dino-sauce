let dino;
let cactus = [];


function setup() {
  createCanvas(1500,500);
  dino = new Dino(NaN);
}


function draw() {
  background(0)
  dino.update();
  dino.render();
}


function keyPressed(){
  if(key = " "){
    dino.jump();
  }
}
