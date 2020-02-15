let eval = NaN;
let j = 0;
let best;

let xorIn = [
  [0.0, 0.0],
  [0.0, 1.0],
  [1.0, 0.0],
  [1.0, 1.0]
];

let xorOut = [0.0, 1.0, 1.0, 0.0];

function setup(){
  createCanvas(600, 570);

  geneFitnes = new Map();
  best = new Genome().init(2, 1);
  eval = new Evaluator(150, 2, 1, function(genome){
    let fitness = 4;
    for(let i = 0; i<xorOut.length; i++){
      // console.log(xorIn[i], xorOut[i])
      fitness -= Math.abs(genome.feed(xorIn[i])[0]-xorOut[i]);
    }
    return fitness
  });
}

function draw(){
  best.render();
}


function keyPressed(){
  if(key == "e"){
    for(var i = 0; i < 20; i++){
      eval.evaluate();
      best = eval.fittestGenome;
      console.log("\n\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- "+j+" -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
      console.log("highest fitness: "+eval.highestScore);
      console.log("Amount of species: "+eval.species.length);
      console.log("mean fitness: "+eval.meanScore);
      console.log("mean nodes length: "+eval.meanHiddenNodes);
      console.log("mean connections length: "+eval.meanConnections);
      console.log("highest genome output 0, 0: "+eval.fittestGenome.feed([0.0, 0.0])[0]);
      console.log("highest genome output 0, 1: "+eval.fittestGenome.feed([0.0, 1.0])[0]);
      console.log("highest genome output 1, 0: "+eval.fittestGenome.feed([1.0, 0.0])[0]);
      console.log("highest genome output 1, 1: "+eval.fittestGenome.feed([1.0, 1.0])[0]);
      console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
      j++;
    }

  }
}
