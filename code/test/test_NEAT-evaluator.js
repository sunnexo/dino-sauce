

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

var geneFitnes;

function setup(){
  createCanvas(600, 570);

  geneFitnes = new Map();
  best = new Genome().init(2, 1);
  eval = new Evaluator(150, 2, 1, function(genome){
    // let fitness = 4;
    // for(let i = 0; i<xorOut.length; i++){
    //   // console.log(1/abs(genome.feed(xorIn[i])[0]-xorOut[i]), xorIn[i], xorOut[i], genome.feed(xorIn[i]))
    //   let output = genome.feed(xorIn[i])[0];
    //   console.log(xorIn[i], output)
    //   fitness -= abs(output - 0.0);
    // }
    // return fitness;
    // return random()
    // return geneFitness.get(genome);
    return genome.nodes.size;
  });
  for(let gen of eval.genomes){
    geneFitnes.set(gen, 0.0);
  }
}

function draw(){
  best.render();
}

function makeFitness(){
  for(let [gen, ok] of geneFitnes){
    // geneFitness.set(gen, (gen.feed([0, 0])[0]-1))
    let fit = 0;
    // try{
      // fit = 1/(gen.feed([0, 0])[0]-0.21);
      fit = gen.nodes.size;
    // }catch(e){
    //   console.error(e);
    //   throw new Error("errrorrr")
    // }
    if(fit < 0){
      fit = 0;
    }
    geneFitnes.set(gen, fit)
  }
}

function keyPressed(){
  if(key == "e"){
    for(var i = 0; i < 10; i++){
      makeFitness();
      eval.evaluate();
      best = eval.fittestGenome;
      // geneFitnes.clear();
      // for(let gen of eval.genomes){
      //   geneFitnes.set(gen, NaN);
      // }
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
