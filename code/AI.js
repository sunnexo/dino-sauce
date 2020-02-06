
class AI{
  constructor(){
    this.cactuses = [];
    for(var i = 0; i < floor(width/(width/5)); i++){
      this.cactuses.push(new Cactus(width + random(0, width * 2)))
    }
    this.backupAIs = []
    this.size = 5000;  // how many AIs are training
    this.speed = 10; // call update n time before calling render
    this.ais = []; // an array where all the AIs will be.
    this.hiddenNodes = 15;
    this.NNinputs = width/(width/5)*2+3
    for(var i = 0; i < this.size; i++){
      this.ais.push(new playerBot(new NeuralNetwork(this.NNinputs, this.hiddenNodes, 3), true))
    }
    // for(var i = 0; i < this.size; i++){
    //   this.backupAIs.push(this.ais[i]);
    // }
    this.showOne = false;
    this.showOneIndex = 0;
    this.howManyToRender = 20;
    // this.deadAIs = [];
    this.roundNumber = 0;
    this.return = false;
    this.timer = 0;
    this.countTo = this.roundNumber*30 + 500;
    this.mutate = 0.4;
    this.mutateChange = 0.1;
    this.debug = true;
    this.bestAILastRound = NaN;
    this.renderIfDead = true;
    this.parentsLastRound = 0;
    this.surviversAis = [];
  }

  update(){
    for(var n = 0; n < this.speed; n++){
      this.timer++;

      for(var i = 0; i < this.cactuses.length; i++){
        let cactus = this.cactuses[i]
        cactus.move();
      }
      for(var i = 0; i < this.ais.length; i++){
        // if(!this.ais[i].dead){
          this.ais[i].update(this.cactuses);
        // }else{
        //   this.deadAIs.push(this.ais[i].ID)
        // }
      }
      // for(var i = 0; i < this.deadAIs.length; i++){
      //   for(var j = 0; j < this.ais.length; j++){
      //     if(this.ais[j].ID == this.deadAIs[i]){
      //       this.ais.splice(j, j+1)
      //     }
      //   }
      // }
      // if(this.ais.length < 1){
      //   for(var i = 0; i < this.deadAIs.length; i++){
      //     for(var j = 0; j < this.backupAIs.length; j++){
      //       if(this.backupAIs[j].ID == this.deadAIs[i]){
      //         this.allDead(this.backupAIs[j])
      //         break;
      //       }
      //     }
      //   }
      // }

      if(this.timer > this.countTo){
        let lowestHitCounter = Infinity;
        let bestAIs = [];
        let index;
        for(var i = 0; i < this.ais.length; i++){
          let hit;
          if(this.ais[i].hits == 0){
            hit = 0;
          }else{
            hit = Math.ceil((this.ais[i].hits+1)/10)*10;
          }
          if(hit < lowestHitCounter){
            bestAIs = [];
            bestAIs.push(this.ais[i]);
            index = i;
            lowestHitCounter = hit;
          }else if(hit == lowestHitCounter){
            bestAIs.push(this.ais[i]);
          }
        }
        if(bestAIs.length == 1){
          this.ais.pop(index);
          let ai;
          let fitness = Infinity;
          for(var i = 0; i < this.ais.length; i++){
            if(this.ais[i].hits < fitness){
              fitness = this.ais[i].hits;
              ai = this.ais[i]
            }
          }
          bestAIs.push(ai);
        }
        this.parentsLastRound = bestAIs.length;
        this.timer = 0;
        this.bestAILastRound = lowestHitCounter/10;
        this.allDead(bestAIs)
      }
      // this.deadAIs = []
    }
  }

  allDead(bestAIs){
    for(let ai of bestAIs){
      if(ai.hits == 0){
        this.surviversAis.push(ai);
      }
    }
    this.roundNumber++;
    // this.countTo = this.roundNumber*30 + 1000;
    // this.mutate *= 0.9;
    this.cactuses = [];
    for(var i = 0; i < floor(width/(width/5)); i++){
      this.cactuses.push(new Cactus(width + random(0, width)))
    }
    this.ais = [];
    for(var i = 0; i < this.size; i++){
      this.ais.push(new playerBot(bestAIs))
    }
    this.ais.concat(this.surviversAis)
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
    if(action[0] > 0){
      this.player.jump();
    }if(action[1] > 0){
      this.player.move(false, true)
    }if(action[2] > 0){
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
    inputs.push(this.player.yVell/-50)
    // inputs.push(this.player.isJumping/2)
    // inputs.push(this.player.dy/height*-0.22)
    // inputs.push(this.player.dx/width*0.0733333)
    inputs.push(this.player.y/height)
    inputs.push(this.player.x/width)
    for(var i = 0; i < cactuses.length; i++){
      inputs.push(map(cactuses[i].x, -width, width * 2, -1, 0))
      // inputs.push(cactuses[i].dx/width*0.0333)
      inputs.push(map(cactuses[i].height, 2, 4, -1, 1))
      // inputs.push(cactuses[i].speed/40)
    }
    // let overOne = false;
    // let index = NaN;
    // for(var i = 0; i < inputs.length; i++){
    //   if(inputs[i]>1 | inputs[i]<-1){
    //     index = i;
    //     overOne = true;
    //   }
    // }
    // if(overOne){
    //   console.log(index+" "+inputs[index])
    // }

    return inputs;
  }
}
