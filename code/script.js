let dino;
let cactuses = [];


function setup() {
  createCanvas(1500,500);
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
  if(key = " "){
    dino.jump();
  }
  if(key = " " && !dino.run){
    console.log("test")
    reset()
  }
}
