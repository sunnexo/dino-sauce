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
        if(dino.y < this.yPos + 100 && dino.y - dino.dy > this.yPos){
          noLoop()
        }
      }
    }
}
