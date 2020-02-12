class Evaluator {
  constructor(populationSize, startingGenome, evaluateGenome) {
    this.evaluateGenome = evaluateGenome; // function for looping over each genom.

    this.c1 = 1;
    this.c2 = 1;
    this.c3 = 1;
    this.DT = 3;
    this.MUTATION_RATE = 0.5;
    this.ADD_CONNECTION_RATE = 0.5;
    this.ADD_NODE_RATE = 0.2;

    this.populationSize = populationSize;

    this.speciesMap = new Map();
    this.scoreMap = new Map();

    this.genomes = [];
    this.nextGenGenomes = [];
    this.species = [];

    this.highestScore = 0;
    this.fittestGenome = NaN;

    for (var i = 0; i < populationSize; i++) {
      this.genomes.push(startingGenome.copy())
    }
  }


  evaluate() {
    // console.log({
    //   "species": [...this.species],
    //   "genomes": [...this.genomes],
    //   "next gen genomes": [...this.nextGenGenomes]
    // });

    // Reset everything for next generation
    for (let s of this.species) {
      s.reset();
    }
    this.scoreMap.clear();
    this.speciesMap.clear();
    this.nextGenGenomes = [];
    this.highestScore = 0;
    this.fittestGenome = NaN;


    // Place genomes into species

    for (let g of this.genomes) {
      var foundSpecies = false;
      for (let s of this.species) {
        if (Genome.compatibilityDistance(g, s.mascot, this.c1, this.c2, this.c3) < this.DT) {
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
        // console.log("new species!!! ", newSpecies.copy(), new Map(this.speciesMap), g.copy(), [...this.species])
      }
    }
    // console.log({"species":[...this.species], "genomes":[...this.genomes], "next gen genomes":[...this.nextGenGenomes]})

    // Remove unused species
    for (let i = this.species.length - 1; i > 0; i--) { // TODO: check if correct
      if (Array.isArray(this.species[i].members) && this.species[i].members.length) {
        this.species.pop(i);
      }
    }

    // Evaluate genomes and assign fitness
    for (let g of this.genomes) {
      let s = this.speciesMap.get(g);
      // console.log("specie of genome: ", s.copy())
      let score = this.evaluateGenome(g);
      let adjustedScore = score / this.speciesMap.get(g).members.length;

      s.addAdjustedFitness(adjustedScore);
      let fg = new FitnessGenome(g, adjustedScore);
      // console.log("fitness genome: ", fg)
      s.fitnessPop.push(new FitnessGenome(g, adjustedScore));
      this.scoreMap.set(g, adjustedScore);
      if (score > this.highestScore) {
        this.highestScore = score;
        this.fittestGenome = g;
      }
    }

    for(let s of this.species){
      if(s.members.length != s.fitnessPop.length){
        console.log("s.members.length != s.fitnessPop  ", [...s.members], [...s.fitnessPop])
      }
    }

    // Put best genomes from each species into next generation
    for (let s of this.species) {
      let fittestInSpecies = s.fitnessPop[0];
      if(fittestInSpecies == undefined){
        console.log("fittestInSpecies is undefined: ", fittestInSpecies, [...s.fitnessPop], s, [...this.species])
      }
      let highestFitnessScore = 0;
      let check = false;
      // console.log("SPECIE ", s, highestFitnessScore, fittestInSpecies)
      for (let fp of s.fitnessPop) {
        // console.log(fp,highestFitnessScore)
        if (highestFitnessScore <= fp.fitness) {
          highestFitnessScore = fp.fitness;
          fittestInSpecies = fp.genome;
          check = true;
        }
      }
      if(!check){
        // console.log("HELPHELP:    "+fittestInSpecies, highestFitnessScore, [...this.species], this.speciesMap);
      }
      // console.log("child: ", fittestInSpecies)
      this.nextGenGenomes.push(fittestInSpecies);
    }
    // console.log({"species":[...this.species], "genomes":[...this.genomes], "next gen genomes":[...this.nextGenGenomes]})


    // Breed the rest of the genomes
    while (this.nextGenGenomes.length < this.populationSize) {
      // replace removed genomes by randomly breeding
      let s = this.getRandomSpeciesBiasedAdjustedFitness();

      let p1 = this.getRandomGenomeBiasedAdjustedFitness(s);
      let p2 = this.getRandomGenomeBiasedAdjustedFitness(s);

      let child;
      if (this.scoreMap.get(p2) >= this.scoreMap.get(p1)) {
        child = Genome.crossover(p1, p2);
      } else {
        child = Genome.crossover(p2, p1);
      }
      if (Math.random() < this.MUTATION_RATE) {
        child.mutate();
      }
      if (Math.random() < this.ADD_CONNECTION_RATE) {
        child.addConectionMutation();
      }
      if (Math.random() < this.ADD_NODE_RATE) {
        child.addNodeMutation();
      }
      // console.log("child: ", child)
      if(child == undefined){
        console.log("oje, er ging iets fout...  ", p1, p2)
      }
      this.nextGenGenomes.push(child);
    }
    // console.log({"species":[...this.species], "genomes":[...this.genomes], "next gen genomes":[...this.nextGenGenomes]})


    this.genomes = [...this.nextGenGenomes];
    // console.log({"species":[...this.species], "genomes":[...this.genomes], "next gen genomes":[...this.nextGenGenomes]})

    this.nextGenGenomes = [];

    for(let genome of this.genomes){
      if(genome == undefined){
        // console.log("genome undefind ", new Map(this.speciesMap), [...this.genomes], [...this.species], new Map(this.scoreMap))
        throw new RuntimeException("undefind genome...");
      }
    }
  }


  /**
   * Selects a random species from the species list, where species with a higher
   * total adjusted fitness heve a highter change to reproduce.
   */
  getRandomSpeciesBiasedAdjustedFitness() {
    let completeWeight = 0;
    for (let s of this.species) {
      completeWeight += s.totalAdjustedFitness;
    }
    let r = Math.random() * completeWeight;
    let countWeight = 0;
    for (let s of this.species) {
      countWeight += s.totalAdjustedFitness;
      if (countWeight >= r) {
        return s;
      }
    }
    throw new RuntimeException("Couldn't find a species...");
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
