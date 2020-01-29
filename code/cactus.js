class Cactus{
    constructor(x){
        this.x = x;
        this.y = height;
        this.dy = random(-200, -50);
        this.dx = 40;
    }
    move(){
        if (this.x > -400){
            this.x -= 10;
        }
        else{
            this.x = width + random(0, 400);
            this.dy = random(-150, -50)
        }
    }
    render(){
        fill(255, 0, 0);
        rect(this.x, this.y, this.dx, this.dy);
    }

    collision(dino){
      if(this.x > dino.x - dino.dx && this.x - this.dx < dino.x){
        console.log(this.x, dino.x);
        dino.score += 0.14285714285714285714285714285714;
        if(this.y > dino.y + dino.dy && this.y + this.dy < dino.y){
          if(round(dino.score) > highScore){
            highScore = round(dino.score);
          }
          fill(255, 0, 0);
          textSize(52);
          text("GAME OVER", width/2-200, height/2);
          background(0);
          image(iGameover,0,0,width,height);
          push()
          textSize(40);
          fill(255);
          text("score: "+round(dino.score), 100, height/2-25)
          text("high score: "+highScore, 100, height/2+25)
          pop()
          sDamage.play();
          dino.run = false;
        }
      }
    }
}
