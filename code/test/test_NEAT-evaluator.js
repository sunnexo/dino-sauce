

let eval = NaN;
let j = 0;
let best = NaN;

function setup(){
  createCanvas(600, 570);
  eval = new Evaluator(1000, new Genome().init(2, 1), function(genome){
    return Object.keys(genome.nodes).length+Object.keys(genome.connections).length;
  });
  eval.evaluate();
  console.log("\n\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- "+j+" -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
  console.log("highest fitness: "+eval.highestScore);
  console.log("Amount of species: "+eval.species.length);
  console.log("highest fitness: "+eval.highestScore);
  console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
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
      console.log("\n\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- "+j+" -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
      console.log("highest fitness: "+eval.highestScore);
      console.log("Amount of species: "+eval.species.length);
      console.log("highest fitness: "+eval.highestScore);
      console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
      best = eval.fittestGenome;
      j++;
    }
  }
}
