class Game{
  constructor(render, isBot){
    this.isAI = isBot;
    this.render = render;
    this.dino = new Dino(isBot);
    this.cactuses = [];
    this.howManyCactuses = floor(width/(width/8));
    for(var i = 0; i < this.howManyCactuses; i++){
      this.cactuses.push(new Cactus(width + i* width/3))
    }
    this.dead = false;
  }

  static ground(){
    return height - 78;
  }

  update(){
    if(this.render){
      background(megaman_bg);
      push()
      fill(255)
      textSize(30);
      if(round(this.dino.score) > gameState.highScore){
        gameState.highScore = round(this.dino.score);
      }
      text("Score: "+round(this.dino.score), 40, 40)
      text("High score: "+ gameState.highScore, 40, 80)
      pop()
      for(var i = 0; i < this.cactuses.length; i++){
        let cactus = this.cactuses[i]
        cactus.render();
      }
      this.dino.render()
      for(var i = 0; i < this.cactuses.length; i++){
        let cactus = this.cactuses[i]
        cactus.collision(this.dino);
        cactus.move(this.cactuses);
      }
      this.dino.update();
    }
    this.dead = !this.dino.run;

  }

  jump(){
    this.dino.jump();
  }

  isDeath(){
    return this.dead;
  }
}
