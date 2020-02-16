class Evaluator {
  constructor(populationSize, inputs, outputs) {
    // this.evaluateGenome = evaluateGenome; // function for looping over each genom.

    this.c1 = 2.8;
    this.c2 = 2.5;
    this.c3 = 3; // or 3
    this.DT = 2.4;
    this.MUTATION_RATE = 0.55;
    this.ADD_CONNECTION_RATE = 0.07;
    this.DISABLE_CONNECTION_RATE = 0.03;
    this.ADD_NODE_RATE = 0.03;

    this.populationSize = populationSize;

    this.speciesMap = new Map();
    this.scoreMap = new Map();

    this.genomes = [];
    this.nextGenGenomes = [];
    this.species = [];

    this.highestScoreAllTime = 0;
    this.fittestGenomeAllTime = new Genome().init(inputs, outputs);
    this.highestScore = 0;
    this.fittestGenome = new Genome().init(inputs, outputs);
    this.meanScore = 0;
    this.meanHiddenNodes = inputs + outputs;
    this.meanConnections = 0;

    for (var i = 0; i < populationSize; i++) {
      this.genomes.push(new Genome().init(inputs, outputs));
    }
    // console.log(this.genomes[0])
  }

  evaluate(evaluateGenome) {
    // Reset everything for next generation
    for (let s of this.species) {
      s.reset();
    }
    this.scoreMap.clear();
    this.speciesMap.clear();
    this.nextGenGenomes = [];
    this.highestScore = 0;
    this.fittestGenome = NaN;
    this.meanScore = 0;
    this.meanHiddenNodes = 0;
    this.meanConnections = 0;

    // Place genomes into species
    for (let g of this.genomes) {
      this.meanHiddenNodes += g.nodes.size;
      this.meanConnections += g.connections.size;
      var foundSpecies = false;
      for (let s of this.species) {
        if (g.nodes == undefined || s.mascot.nodes == undefined) {
          console.log("g or mascot is undefined", g, s.mascot);
        }
        if (
          Genome.compatibilityDistance(g, s.mascot, this.c1, this.c2, this.c3) <
          this.DT
        ) {
          s.members.push(g);
          this.speciesMap.set(g, s);
          foundSpecies = true;
          break;
        }
      }
      if (!foundSpecies) {
        let newSpecies = new Species(g);
        this.species.push(newSpecies);
        this.speciesMap.set(g, newSpecies);
      }
    }

    // Remove unused species
    var rem = false;
    for (let i = this.species.length - 1; i > -1; i--) {
      // TODO: check if correct
      if (this.species[i].members.length === 0) {
        // hire is the problem TODO: TODO:
        // this.speciesMap.set(g);
        // console.log(i, this.species[i].copy())
        this.species.splice(i, 1);
      }
    }

    // Evaluate genomes and assign fitness
    let test = [];
    for (let s of this.species) {
      test.push(s.copy());
    }
    for (let g of this.genomes) {
      let s = this.speciesMap.get(g);
      let score = evaluateGenome(g);
      this.meanScore += score;
      let adjustedScore = score / this.speciesMap.get(g).members.length;

      s.addAdjustedFitness(adjustedScore);
      s.fitnessPop.push(new FitnessGenome(g, score));
      this.scoreMap.set(g, score);
      if (score > this.highestScoreAllTime) {
        this.highestScoreAllTime = score;
        this.fittestGenomeAllTime = g;
      }
      if (score > this.highestScore) {
        this.highestScore = score;
        this.fittestGenome = g;
      }
      if (g.checkIfNoLoop()) {
        console.log(g.copy());
        throw new Error("grrrr");
      }
    }

    // Put best genomes from each species into next generation
    test = [];
    for (let s of this.species) {
      test.push(s.copy());
    }
    // console.log([...test])

    for (let s of this.species) {
      let fittestInSpecies = s.fitnessPop[0].genome;
      if (fittestInSpecies === undefined || fittestInSpecies === null) {
        console.log(
          "fittestInSpecies is undefined: ",
          fittestInSpecies,
          [...s.fitnessPop],
          s,
          [...this.species]
        );
      }
      let highestFitnessScore = 0;
      let check = false;
      for (let fp of s.fitnessPop) {
        if (highestFitnessScore < fp.fitness) {
          highestFitnessScore = fp.fitness;
          fittestInSpecies = fp.genome;
          check = true;
        }
      }
      if (fittestInSpecies instanceof FitnessGenome) {
        console.error("help", fittestInSpecies);
      }
      this.nextGenGenomes.push(fittestInSpecies);
    }

    // let getS = [];
    // Breed the rest of the genomes
    while (this.nextGenGenomes.length < this.populationSize) {
      // replace removed genomes by randomly breeding
      let s = this.getRandomSpeciesBiasedAdjustedFitness();
      let p1 = this.getRandomGenomeBiasedAdjustedFitness(s);
      let p2 = this.getRandomGenomeBiasedAdjustedFitness(s);
      // getS.push([s.copy(), p1.copy(), p2.copy()]);
      if (p1 instanceof FitnessGenome || p2 instanceof FitnessGenome) {
        console.log(
          "p1 is instanceof FitnessGenome of p2 is instanceof FitnessGenome",
          p1,
          p2
        );
      }
      let child;
      if (this.scoreMap.get(p2) <= this.scoreMap.get(p1)) {
        child = Genome.crossover(p1, p2);
      } else {
        child = Genome.crossover(p2, p1);
      }
      if (Math.random() < this.ADD_NODE_RATE) {
        child.addNodeMutation();
      }
      if (Math.random() < this.ADD_CONNECTION_RATE) {
        child.addConectionMutation();
      }
      if (Math.random() < this.MUTATION_RATE) {
        child.mutate();
      }
      if (Math.random() < this.DISABLE_CONNECTION_RATE) {
        child.disableConectionMutation();
      }
      if (child.checkIfNoLoop()) {
        console.log(p1.checkIfNoLoop(), p2.checkIfNoLoop(), child);
        throw new Error("grrrr");
      }

      // console.log(p1.copy(), p2.copy(), child.copy())
      // console.log("child: ", child)
      // if(child.nodes.size > this.highestScore){
      //   console.log(child)
      // }
      if (
        child === undefined ||
        child === null ||
        child instanceof FitnessGenome
      ) {
        console.log("oje, er ging iets fout...  ", p1, p2);
      }
      this.nextGenGenomes.push(child);
    }
    // console.log(getS)

    this.genomes = [...this.nextGenGenomes];

    this.nextGenGenomes = [];

    for (let genome of this.genomes) {
      if (genome instanceof FitnessGenome) {
        console.log("genome is instanceof FitnessGenome", genome);
      }
      if (genome == undefined || genome == null) {
        console.log(
          "genome undefind ",
          new Map(this.speciesMap),
          [...this.genomes],
          [...this.species],
          new Map(this.scoreMap)
        );
        throw new RuntimeException("undefind genome...");
      }
      if (genome.checkIfNoLoop()) {
        console.log(genome.copy());
        throw new Error("grrrr");
      }
    }
    this.meanScore /= this.genomes.length;
    this.meanHiddenNodes /= this.genomes.length;
    this.meanConnections /= this.genomes.length;
  }

  /**
   * Selects a random species from the species list, where species with a higher
   * total adjusted fitness heve a highter change to reproduce.
   */
  getRandomSpeciesBiasedAdjustedFitness() {
    // let completeWeight = 0;
    // for (let s of this.species) {
    //   completeWeight += s.totalAdjustedFitness;
    // }
    // let r = Math.random() * completeWeight;
    // let countWeight = 0;
    // for (let s of this.species) {
    //   countWeight += s.totalAdjustedFitness;
    //   if (countWeight >= r) {
    //     return s;
    //   }
    // }
    // throw new RuntimeException("Couldn't find a species...");
    const mapSort1 = this.species.sort(
      (a, b) => b.totalAdjustedFitness - a.totalAdjustedFitness
    );
    return mapSort1[
      Math.floor(random(0, random(0, random(0, random(0, mapSort1.length)))))
    ];
  }

  /**
   * Selects a random genome from the species chosen, where genome with a higher
   * total adjusted fitness heve a highter change to reproduce.
   */
  getRandomGenomeBiasedAdjustedFitness(selectFrom) {
    let completeWeight = 0;
    for (let fg of selectFrom.fitnessPop) {
      completeWeight += fg.fitness;
    }
    let r = Math.random() * completeWeight;
    let countWeight = 0;
    for (let fg of selectFrom.fitnessPop) {
      countWeight += fg.fitness;
      if (countWeight >= r) {
        return fg.genome;
      }
    }
    throw new RuntimeException("Couldn't find a genome...");
  }
}

class FitnessGenome {
  constructor(genome, fitness) {
    this.fitness = fitness;
    this.genome = genome;
  }

  static compare(one, two) {
    if (one.fitness > two.fitness) {
      return 1;
    } else if (one.fitness < two.fitness) {
      return -1;
    } else {
      return 0;
    }
  }
}
