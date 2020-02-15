
class AI{
  constructor(){
    this.cactuses = [];
    for(var i = 0; i < floor(width/(width/4)); i++){
      // new cactuses (obsitcals) based on the width of the screen wil be created.
      // this.cactuses.push(new Cactus(width + random(0, width * 2)))
      this.cactuses.push(new Cactus(width + i * width/2))
    }
    this.size = 1000;  // how many AIs are training
    this.speed = 1; // call update n time before calling render

    // this.NEATinput = 4+floor(width/(width/4))*2;  // how manny inputs the neat has
    this.NEATinput = 9;  // how manny inputs the neat has
    this.NEAToutput = 2;  // how manny outputs the neat has
    this.NEAT_Player = new Map(); // an array where all the AIs will be.

    this.evaluator = new Evaluator(this.size, this.NEATinput, this.NEAToutput)

    for(var i = 0; i<this.size; i++){
      this.NEAT_Player.set(this.evaluator.genomes[i], new PlayerBot(this.evaluator.genomes[i]))
    }

    this.historyBestAI = [];  // the history of the best AI of every round.
    this.howManyToRender = 150; // how manny to draw on the screen.
    this.iterations = 0;  // how menny round have the AIs died.
    this.showBest = false;  // if show only the best of last round.
    this.flexSpeed = false;

    this.return = false; // for UI (user interface).
    this.debug = true; // show information about the training.
  }


  /**
   * clear all the players and genomes and evvolve the NEAT.
   * then fill the players and genomes with better genomes and players.
   */
  reset(){
    for(let [g, p] of this.NEAT_Player){
      g.fitness = p.fitness;
    }
    this.evaluator.evaluate(function(g){
      return g.fitness;
    });
    this.NEAT_Player.clear();
    for(var i = 0; i < this.size; i++){
      this.NEAT_Player.set(this.evaluator.genomes[i], new PlayerBot(this.evaluator.genomes[i]))
    }
  }

  /**
   * This function is called 60 times per second.
   * It handles everything that has to do with the AI.
   */
  update(){
    if(this.flexSpeed){
      if(frameRate()<40){
        if(this.speed>1){
          this.speed--;
        }
      }else{
        this.speed++;
      }
    }
    for(var n = 0; n < this.speed; n++){
      for(let cactus of this.cactuses){
        // first update all cactuses before the ais.
        cactus.move();
      }

      var howManyDeaths = 0;
      for(let [genome, player] of this.NEAT_Player){
        player.update(this.cactuses);
        if(player.dead){
          howManyDeaths++;
        }
      }
      if(howManyDeaths == this.NEAT_Player.size){
        // console.log("IM DEATH!!!", howManyDeaths, this.NEAT_Player)
        this.allDead()
        break;
      }
    }
  }

  allDead(){
    if(this.flexSpeed){
      this.speed = 1;
    }
    this.iterations++;
    this.cactuses.length = 0;
    for(var i = 0; i < floor(width/(width/4)); i++){
      this.cactuses.push(new Cactus(width + (i * width/2) * random(0, 3)))
      // this.cactuses.push(new Cactus(width + random(0, width)))
    }
    this.reset()
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
    if(this.debug){
      this.evaluator.fittestGenome.render();
    }if(this.showBest){
      this.NEAT_Player.get(this.evaluator.fittestGenome).render()
    }
    else{
      var j = 0;
      for(var [genome, player] of this.NEAT_Player){
        if(j>this.howManyToRender){
          break;
        }
        if(player.dead == false){
          j++;
          player.render();
        }
      }
    }

    if(this.debug){
      push()
      textSize(24)
      fill(220)
      text("frame Rate: "+          str(frameRate()), 20,                     30)
      text("Iterations: "+          str(this.iterations), 20,                 60)
      text("Training Speed: "+      str(this.speed), 20,                      90)
      text("How many AIs: "+        str(this.size), 20,                       120)
      text("mean hidden nodes: "+   str(this.evaluator.meanHiddenNodes-(this.NEATinput+this.NEAToutput)), 20,  150)
      text("mean connections: "+    str(this.evaluator.meanConnections), 20,  180)
      text("How many Cactuses: "+   str(this.cactuses.length), 20,            210)
      text("NEAT inputs: "+         str(this.NEATinput), 20,                  240)
      text("highest fitness: "+     str(this.evaluator.highestScore), 20,     270)
      text("Amount of species: "+   str(this.evaluator.species.length), 20,   300)
      text("mean fitness: "+        str(this.evaluator.meanScore), 20,        330)
      text("best fitness all time: "+str(this.evaluator.highestScoreAllTime), 20,360)
      pop()
    }
  }

  keyHandeler(key){
    if(key == "m"){ // goto menu
      this.return = new Menu();
    }
    if(key == "b"){ // show best last round
      this.showBest = !this.showBest;
    }
    if(key == "f"){ // go faster
      this.speed++;
    }if(key == "s"){ // go slower
      if(this.speed>1){
        this.speed--;
      }
    }
    if(key == "d"){ // togle debug
      this.debug = !this.debug;
    }
    if(key == "r"){ // reset speed
      this.speed = 1;
    }
    if(key == "a"){
      this.flexSpeed = !this.flexSpeed;
    }
  }
}

class PlayerBot{
  constructor(genome){
    this.dead = false;
    this.player = new Dino(true);
    this.genome = genome;
    this.fitness = 0;
  }

  update(cactuses){
    if(!this.dead){
      this.player.update();
      let action = this.genome.feed(this.getInputs(cactuses));
      if(action[0] > 0.5){
        this.player.jump();
      }if(action[1] > 0.5){
        this.player.move(false, true)
      }else{
        this.player.move(true, false)
      }
      var hit = false;
      var scoreSum = 0;
      var lefts = 0;
      for(var cactus of cactuses){
        if(cactus.x+cactus.dx < this.player.x){
          lefts++;
        }
        scoreSum += cactus.resets;
        hit = hit | cactus.collision(this.player, true)
      }if(hit){
        this.dead = true;
      }
      if(!this.dead){
        this.fitness = scoreSum+lefts;
      }
    }
  }

  render(){
    if(!this.dead){
      this.player.render();
    }
  }

  getInputs(cactuses){
    var inputs = []
    inputs.push(map(this.player.yVell, -50, 50, -1, 1))
    inputs.push(map(this.player.y, 0, height, -1, 1))
    inputs.push(map(this.player.x, 0, width, -1, 1))
    inputs.push(map(this.player.isJumping, 0, 3, -1, 1))
    inputs.push(map(cactuses[0].speed, 10, 40, -1, 1))
    cactuses = cactuses.sort((a, b) => a.x - b.x);
    let c1 = null;
    let c2 = null;
    for(let i = 0; i < cactuses.length; i++){
      if(cactuses[i].x > this.player.x){
        c1 = cactuses[i];
        if(i != cactuses.length-1){
          c2 = cactuses[i+1];
        }
        break;
      }
      // inputs.push(map(cactuses[i].x, -width, width * 2, -1, 0))
      // inputs.push(map(cactuses[i].height, 2, 4, -1, 1))
    }
    if(c1 == null){
      inputs.push(0);
      inputs.push(0);
    }else{
      inputs.push(map(c1.x, -width, width*2, -1, 1))
      inputs.push(map(c1.height, 2, 4, -1, 1));
    }
    if(c2 === null){
      inputs.push(0);
      inputs.push(0);
    }else{
      inputs.push(map(c2.x, -width, width*2, -1, 1))
      inputs.push(map(c2.height, 2, 4, -1, 1));
    }
    return inputs;
  }
}
