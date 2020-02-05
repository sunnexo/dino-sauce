
class AI{
  constructor(){

    this.size = 20;  // how many AIs are training
    this.speed = 1; // call update n time before calling render
    this.ais = []; // an array where all the AIs will be.
    for(var i = 0; i < this.size; i++){
      this.ais.push(new playerBot(new NeuralNetwork(width/(width/5)*5+6, 10, 3)))
    }

    this.roundNumber = 0;
    this.return = false;
  }

  update(){

  }

  allDead(){

  }

  coppyBest(){

  }

  changeGameState(){
    return this.return;
  }

  render(){
    background(0);
  }

  keyHandeler(key){
    if(key == "r"){
      this.return = new Menu();
    }
  }
}

class playerBot{
  constructor(parent){
    this.dead = false
    this.cactuses = [];
    this.player = new Game(true, true);
    this.nn = parent.copy().mutate(0.1);
  }

  update(){
    this.player.update()
    this.dead = this.player.isDeath();
    let action = this.nn.predict(this.player.getInputs());
    
  }


}
