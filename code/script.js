let dino;
let cactuses = [];


function setup() {
  createCanvas(1500,500);
  dino = new Dino(NaN);
  cactuses.push(new Cactus(width+30));
  cactuses.push(new Cactus(width+500));
  cactuses.push(new Cactus(width+1000));
  cactuses.push(new Cactus(width+1500));
  console.log(cactuses)
}


function draw() {
  background(0)
  dino.update();
  for(var i = 0; i < cactuses.length; i++){
    cactus = cactuses[i]
    cactus.move();
    cactus.collision(dino);
    cactus.render();
  }
  dino.render();
  cactus.render();

}


function keyPressed(){
  if(key = " "){
    dino.jump();
  }
}
