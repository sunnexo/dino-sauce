class Cactus{
    constructor(x){
        this.xPos = x;
        this.yPos = height;
        this.dy = random(-150, -50)
    }
    move(){
        if (this.xPos > -200){
            this.xPos = this.xPos - 10;
        }
        else{
            this.xPos = width + 20;
            this.dy = random(-150, -50)
        }
    }
    render(){
        fill(255, 0, 0);
        rect(this.xPos, this.yPos, 40, this.dy);
    }

    collision(dino){
      if(dino.x < this.xPos && dino.x + dino.dx > this.xPos){
        dino.score++;
        if(dino.y < this.yPos - this.dy && dino.y - dino.dy > this.yPos){
          fill(255, 0, 0)
          textSize(52);
          text("GAME OVER", width/2, height/2)
          dino.run = false;
        }
      }
    }
}
