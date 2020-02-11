let p1;
let p2;
let child;

const c1 = 1;
const c2 = 1;
const c3 = 1;
const n_max = 50;

let dra;

function setup(){
  createCanvas(1200, 570);
  p1 = new Genome().init(2, 2);
  p2 = new Genome().init(2, 2);
  child = Genome.crossover(p2, p1);
  dra = new drawNN();
  dra.NN = p1
}

function draw(){
  dra.NN.render();
}

function keyPressed(){
  if(key == "n"){
    dra.NN.addNodeMutation()
  }
  if(key == "w"){
    dra.NN.addConectionMutation()
  }
  if(key == "m"){
    dra.NN.mutate();
  }
  if(key == "f"){
    console.log("output: "+dra.NN.feed([0, 1]));
  }
  if(key == "d"){
    console.log("species distance: "+Genome.compatibilityDistance(p1, p2, c1, c2, c3, n_max))
  }
  if(key == "c"){
    dra.NN = Genome.crossover(p1, p2);
  }
  if(key == "1"){
    dra.NN = p1;
  }
  if(key == "2"){
    dra.NN = p2;
  }
  if(key == "3"){
    dra.NN = child;
  }
  if(key == "r"){
    p1 = new Genome().init(2, 2);
    p2 = new Genome().init(2, 2);
    child = Genome.crossover(p2, p1);
    dra = new drawNN();
    dra.NN = p1
  }
}

function drawNN(){
  this.NN = NaN;
}
