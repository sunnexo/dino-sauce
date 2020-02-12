

let eval = NaN;
let j = 0;
let best = NaN;

function setup(){
  createCanvas(600, 570);
  eval = new Evaluator(100, new Genome().init(2, 1), function(genome){
    var weightSum = 0;
    for(let cg in genome.connections){
      if(genome.connections[cg].expressed){
        weightSum += Math.abs(genome.connections[cg].weight);
      }
    }
    return (1000/Math.abs(weightSum-100));
  });
  eval.evaluate();
  console.log("Generation: "+j);
  console.log("highest fitness: "+eval.highestScore);
  console.log("Amount of species: "+eval.species.length);
  console.log("highest fitness: "+eval.highestScore);
  console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=");
  best = eval.fittestGenome;
  j++;
}

function draw(){
  best.render();
}

function keyPressed(){
  if(key == "e"){
    for(var i = 0; i < 10; i++){
      eval.evaluate();
      console.log("Generation: "+j);
      console.log("highest fitness: "+eval.highestScore);
      console.log("Amount of species: "+eval.species.length);
      console.log("highest fitness: "+eval.highestScore);
      console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=");
      best = eval.fittestGenome;
      j++;
    }
  }
}