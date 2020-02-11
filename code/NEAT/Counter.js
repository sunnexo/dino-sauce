


class Counter{
  constructor(val=0){
    this.currentInnovation = val;
  }

  getInnovation(){
    return int(this.currentInnovation++);
  }
  dec(){
    return --this.currentInnovation;
  }
}
