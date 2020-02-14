


class Species{
  constructor(mascot){
    this.mascot = mascot;
    this.members = [];
    this.members.push(mascot);
    this.fitnessPop = [];
    this.totalAdjustedFitness = 0;
  }

  addAdjustedFitness(adjustedFitness) {
    this.totalAdjustedFitness += adjustedFitness;
  }

  reset() {
    if(this.members.length === 0 || this.fitnessPop.length === 0){
      console.log("qwertyuioplkjhgfdsazxcvbnm")
    }
    let newMascotIndex = floor(Math.random()*(this.members.length-1));
    this.mascot = this.members[newMascotIndex];
    this.members = [];
    this.fitnessPop = [];
    // this.members.push(this.mascot)
    this.totalAdjustedFitness = 0;
  }

  copy(){
    let newSpecies = new Species(this.mascot);
    newSpecies.members = this.members;
    newSpecies.totalAdjustedFitness = this.totalAdjustedFitness;
    newSpecies.fitnessPop = this.fitnessPop;
    return newSpecies
  }
}
