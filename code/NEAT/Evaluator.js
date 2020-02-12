class Evaluator {
  constructor(populationSize, startingGenome, evaluateGenome) {
    this.evaluateGenome = evaluateGenome; // function for looping over each genom.

    this.c1 = 1;
    this.c2 = 1;
    this.c3 = 0.4;
    this.DT = 3;
    this.MUTATION_RATE = 0.5;
    this.ADD_CONNECTION_RATE = 0.1;
    this.ADD_NODE_RATE = 0.1;

    this.populationSize = populationSize;

    this.speciesMap = {};
    this.scoreMap = {};

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
    console.log({"species":[...this.species], "genomes":[...this.genomes], "next gen genomes":[...this.nextGenGenomes]})

    // Reset everything for next generation
    for(let s of this.species){
      s.reset();
    }
    this.scoreMap = {};
    this.speciesMap = {};
    this.nextGenGenomes = [];
    this.highestScore = 0;
    this.fittestGenome = NaN;


    // Place genomes into species
    for (let g of this.genomes) {
      var foundSpecies = false;
      for (let s of this.species) {
        if (Genome.compatibilityDistance(g, s.mascot, this.c1, this.c2, this.c3) < this.DT) {
          s.members.push(g);
          this.speciesMap[g] = s;
          console.log({...this.speciesMap})
          foundSpecies = true;
          break;
        }
      }
      if (!foundSpecies) {
        let newSpecies = new Species(g);
        this.species.push(newSpecies);
        this.speciesMap[g] = newSpecies;
        if(this.species.length > 1){
          console.log("new species!!! ", newSpecies, this.speciesMap, g, [...this.species])
          throw new ReferenceError("new species!!! ", newSpecies, this.speciesMap, g, this.species)
        }
      }
    }
    console.log({"species":[...this.species], "genomes":[...this.genomes], "next gen genomes":[...this.nextGenGenomes]})

    // Remove unused species
    for(let i = this.species.length-1; i > 0; i--){ // TODO: check if correct
      if(this.species[i].members == []){
        this.species.pop(i);
      }
    }

    // Evaluate genomes and assign fitness
    for (let g of this.genomes) {
      let s = this.speciesMap[g];
      let score = this.evaluateGenome(g);
      let adjustedScore = score / this.speciesMap[g].members.length;

      s.addAdjustedFitness(adjustedScore);
      s.fitnessPop.push(new FitnessGenome(g, adjustedScore));
      this.scoreMap[g] = adjustedScore;
      if (score > this.highestScore) {
        this.highestScore = score;
        this.fittestGenome = g;
      }
    }
    console.log({"species":[...this.species], "genomes":[...this.genomes], "next gen genomes":[...this.nextGenGenomes]})

    // Put best genomes from each species into next generation
    // console.log("HELPHELP", [...this.species])
    for (let s of this.species) {
      let fittestInSpecies;
      let highestFitnessScore = -1;
      for (let fp of s.fitnessPop) {
        if (highestFitnessScore < fp.fitness) {
          highestFitnessScore = fp.fitness;
          fittestInSpecies = fp.genome;
        }
      }
      if(fittestInSpecies == undefined){
        // console.log("HELPHELP"+fittestInSpecies, highestFitnessScore, [...this.species], this.speciesMap)
      }
      this.nextGenGenomes.push(fittestInSpecies);
    }
    console.log({"species":[...this.species], "genomes":[...this.genomes], "next gen genomes":[...this.nextGenGenomes]})


    // Breed the rest of the genomes
    while (this.nextGenGenomes.length < this.populationSize) {
      // replace removed genomes by randomly breeding
      let s = this.getRandomSpeciesBiasedAdjustedFitness();

      let p1 = this.getRandomGenomeBiasedAdjustedFitness(s);
      let p2 = this.getRandomGenomeBiasedAdjustedFitness(s);

      let child;
      if (this.scoreMap[p2] >= this.scoreMap[p1]) {
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
      this.nextGenGenomes.push(child);
    }
    console.log({"species":[...this.species], "genomes":[...this.genomes], "next gen genomes":[...this.nextGenGenomes]})


    this.genomes = [...this.nextGenGenomes];
    console.log({"species":[...this.species], "genomes":[...this.genomes], "next gen genomes":[...this.nextGenGenomes]})

    this.nextGenGenomes = [];
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
