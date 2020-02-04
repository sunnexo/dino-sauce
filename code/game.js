class Game{
  constructor(render){
    this.render = render;
    this.dino = new Dino();
    this.cactuses = [];
    this.cactuses.push(new Cactus(width+0));
    this.cactuses.push(new Cactus(width+(width/4)*1));
    this.cactuses.push(new Cactus(width+(width/4)*3));
    this.cactuses.push(new Cactus(width*2));
    this.dead = false;
  }

  static ground(){
    return height - 78;
  }

  update(){
    if(this.render){
      this.dead = !this.dino.run
      for(var i = 0; i < this.cactuses.length; i++){
        let cactus = this.cactuses[i]
        cactus.collision(this.dino);
        cactus.move();
      }
      this.dino.update();
      background(megaman_bg);
      push()
      fill(255)
      textSize(30);
      text("Score: "+round(this.dino.score), 40, 40)
      text("High score: "+ gameState.highScore, 40, 80)
      pop()
      this.dino.render()
      for(var i = 0; i < this.cactuses.length; i++){
        let cactus = this.cactuses[i]
        cactus.render();
      }
    }
    this.dead = !this.dino.run

  }

  jump(){
    this.dino.jump();
  }

  isDeath(){
    return this.dead;
  }

  getInputs(){
    return [this.dino.x/width, this.dino.y/height, this.dino.dx/width*0.0733333, this.dino.dy/height*-0.22, this.dino.isJumping/2, this.dino.yVell/-34,
      this.cactuses[0].x/(width + 400+this.cactuses[0].speed*10+width/4), this.cactuses[0].y/height, this.cactuses[0].dx/width*0.0333, this.cactuses[0].dy/height*-0.3, this.cactuses[0].speed/40,
      this.cactuses[1].x/(width + 400+this.cactuses[1].speed*10+width/4), this.cactuses[1].y/height, this.cactuses[1].dx/width*0.0333, this.cactuses[1].dy/height*-0.3, this.cactuses[1].speed/40,
      this.cactuses[2].x/(width + 400+this.cactuses[2].speed*10+width/4), this.cactuses[2].y/height, this.cactuses[2].dx/width*0.0333, this.cactuses[2].dy/height*-0.3, this.cactuses[2].speed/40,
      this.cactuses[3].x/(width + 400+this.cactuses[3].speed*10+width/4), this.cactuses[3].y/height, this.cactuses[3].dx/width*0.0333, this.cactuses[3].dy/height*-0.3, this.cactuses[3].speed/40,
    ]
  }
}
