
class AI{
  constructor(){
    this.cactuses = [];
    for(var i = 0; i < floor(width/(width/4)); i++){
      // new cactuses (obsitcals) based on the width of the screen wil be created.
      this.cactuses.push(new Cactus(width + random(0, width * 2)))
    }
    this.size = 100;  // how many AIs are training
    this.speed = 1; // call update n time before calling render

    this.NEATinput = 5;  // how manny inputs the neat has
    this.NEAToutput = 3;  // how manny outputs the neat has
    this.NEAT_Player = new Map(); // an array where all the AIs will be.

    this.evaluator = new Evaluator(this.size, this.NEATinput, this.NEAToutput, function(g){
      // this function will be called every time the evaluate() function is called.
      return this.NEAT_Player.get(g).getFitness();  // get the fitness of a connectet player
    })

    this.historyBestAI = [];  // the history of the best AI of every round.
    this.howManyToRender = 200; // how manny to draw on the screen.
    this.iterations = 0;  // how menny round have the AIs died.

    this.return = false; // for UI (user interface).
    this.debug = true; // show information about the training.
  }


  /**
   * clear all the players and genomes and evvolve the NEAT.
   * then fill the players and genomes with better genomes and players.
   */
  reset(){
    this.NEAT_Player.clear();
    this.evaluator.evaluate();
    for(var i = 0; i < this.size; i++){
      this.NEAT_Player.set(this.evaluator.genomes[i], new Player(this.evaluator.genomes[i]))
    }
  }

  /**
   * This function is called 60 times per second.
   * It handles everything that has to do with the AI.
   */
  update(){
    for(var n = 0; n < this.speed; n++){
      for(let cactus of this.cactuses){
        // first update all cactuses before the ais.
        cactus.move();
      }

      for(let [genome, player] of this.NEAT_Player){
          this.ais[i].update(this.cactuses);
      }
    }
  }

  allDead(bestAIs){
    let servival = false;
    for(let ai of [...bestAIs]){
      if(ai.hits == 0){
        servival = true;
        this.surviversAis.push(ai);
      }
    }
    if(servival){
      this.countTo += 20;
    }
    this.roundNumber++;
    // this.countTo = this.roundNumber*30 + 1000;
    // this.mutate *= 0.9;
    this.cactuses = [];
    for(var i = 0; i < floor(width/(width/4)); i++){
      this.cactuses.push(new Cactus(width + random(0, width)))
    }
    this.ais = [];
    // this.ais.concat([...this.surviversAis])
    for(var i = 0; i < this.size; i++){
      this.ais.push(new playerBot(bestAIs))
    }
    // this.backupAIs = []
    // for(var i = 0; i < this.size; i++){
    //   this.backupAIs.push(this.ais[i]);
    // }
  }

  changeGameState(){
    return this.return;
  }

  render(){
    background(megaman_bg)
    for(var i = 0; i < this.cactuses.length; i++){
      let cactus = this.cactuses[i]
      cactus.render();
    }
    if(this.showOne){
      this.ais[this.showOneIndex].render();
    }else{
      for(var i = 0; i < this.howManyToRender; i++){
        // if(!this.ais[i].dead){
        if(this.renderIfDead){
          this.ais[i].render();
        }else{
          if(!this.ais[i].dead){
            this.ais[i].render();
          }
        }
        // }
      }
    }
    if(this.debug){
      push()
      textSize(24)
      fill(220)
      text("frame Rate: "+str(frameRate()), 20, 30)
      text("Round Number: "+str(this.roundNumber), 20, 60)
      text("Training Speed: "+str(this.speed), 20, 90)
      text("Mutation Rate: "+str(this.mutate), 20, 120)
      text("Hits of the best AI last round: "+str(this.bestAILastRound), 20, 150)
      text("How many AIs: "+str(this.size+this.surviversAis.length), 20, 180)
      text("Round length: "+str(this.countTo), 20, 210)
      text("Hidden Nodes: "+str(this.hiddenNodes), 20, 240)
      text("How many Cactuses: "+str(this.cactuses.length), 20, 270)
      text("If mutate than change by: "+str(this.mutateChange), 20, 300)
      text("Neural Network inputs: "+str(this.NNinputs), 20, 330)
      text("parents last round to crossover: "+this.parentsLastRound, 20, 360)
      text("total survivers: "+this.surviversAis.length, 20, 390)
      pop()
    }
  }

  keyHandeler(key){
    if(key == "r"){
      this.return = new Menu();
    }
    if(key == "o"){
      this.showOne = !this.showOne;
    }
    if(key == "z"){
      if(this.showOneIndex>0){
        this.showOneIndex--;
      }
    }
    if(key == "x"){
      this.showOneIndex++;
      if(this.showOneIndex >=this.size){
        this.showOneIndex = 0;
      }
    }if(key == "f"){
      this.speed++;
    }if(key == "s"){
      if(this.speed>1){
        this.speed--;
      }
    }if(key == "d"){
      this.debug = !this.debug;
    }
    if(key == "l"){
      this.countTo += 20;
    }if(key == "k"){
      this.countTo -= 20;
    }
    if(key == "q"){
      this.renderIfDead = !this.renderIfDead;
    }
    if(key == "c"){
      this.mutate *= 0.9;
    }if(key =="v"){
      this.mutate *= 1.1;
    }if(key == "w"){
      this.speed = 1;
    }
  }
}

class playerBot{
  constructor(parents, firstMake=false){
    this.ID = str(random(-100000, 100000))
    this.dead = false;
    this.player = new Dino(true);
    if(firstMake){
      this.nn = parents.copy()
    }else{
      this.nn = NeuralNetwork.crossOver(parents);
    }
    // this.nn.mutate(gameState.mutate, gameState.mutateChange);
    this.nn.mutate(gameState.mutateChange, gameState.mutateChange);
    this.hits = 0;
  }

  update(cactuses){
    this.player.update();
    let action = this.nn.predict(this.getInputs(cactuses));
    if(action[0] > 0.5){
      this.player.jump();
    }if(action[1] > 0.5){
      this.player.move(false, true)
    }if(action[2] > 0.5){
      this.player.move(true, false)
    }
    let hit = false;
    for(var cactus of cactuses){
      hit = hit | cactus.collision(this.player, true)
    }if(hit){
      this.hits++;
      this.dead = true;
    }

  }

  render(){
    this.player.render();
  }

  getInputs(cactuses){
    var inputs = []
    inputs.push(map(this.player.yVell, -50, 50, -1, 1))
    inputs.push(map(this.player.y, 0, height, -1, 0))
    inputs.push(map(this.player.x, 0, width, -1, 1))
    let cactus_s = Infinity;
    let c = cactuses[0];
    for(var i = 0; i < cactuses.length; i++){
      if(cactuses[i].x > this.player.x && cactus_s > cactuses[i].x || c == NaN){
        cactus_s = cactuses[i].x;
        c = cactuses[i];
      }
      // inputs.push(map(cactuses[i].x, -width, width * 2, -1, 0))
      // inputs.push(map(cactuses[i].height, 2, 4, -1, 1))
    }
    // console.log(c);
    inputs.push(map(c.x, -width*2, width*2, -1, 1))
    inputs.push(map(c.height, 1, 4, -1, 1))
    return inputs;
  }
}
