class Cactus{
    constructor(x){
        this.speed = 10
        this.x = x;
        this.y = Game.ground();
        this.sprite = round(random(2, 4));
        this.dy = map(this.sprite, 2, 4, height*-0.15, height*-0.3);
        if(this.sprite === 2){
          this.sprite = iEnemy2;
        }else if(this.sprite === 3){
          this.sprite = iEnemy3;
        }else{
          this.sprite = iEnemy4;
        }
        this.dx = width*0.0333333333;
    }
    move(){
      if (this.x > -400){
          this.x -= this.speed;
      }
      else{
          this.x = width + random(0+this.speed*10, 400+this.speed*10+width/4);
          this.sprite = round(random(2, 4));  //random(-200, -50);
          this.dy = map(this.sprite, 2, 4, height*-0.15, height*-0.3);
          if(this.sprite === 2){
            this.sprite = iEnemy2;
          }else if(this.sprite === 3){
            this.sprite = iEnemy3;
          }else{
            this.sprite = iEnemy4;
          }
      }
    }

    render(){
      image(this.sprite,this.x, this.y, this.dx, this.dy)
    }

    collision(dino){
      // console.log(dino);
      this.speed = dino.score/10 + width*0.0083333333
      if(this.x > dino.x - dino.dx && this.x - this.dx < dino.x){
        dino.score += 0.08333333333333333333333333333333;
        if(this.y > dino.y + dino.dy && this.y + this.dy < dino.y){
          if(round(dino.score) > gameState.highScore){
            gameState.highScore = round(dino.score);
          }
          fill(255, 0, 0);
          textSize(52);
          text("GAME OVER", width/2-200, height/2);
          background(0);
          image(iGameover,0,0,width,height);
          push()
          textSize(40);
          fill(255);
          text("score: "+round(dino.score), 50, height/2-25)
          text("high score: "+gameState.highScore, 50, height/2+25)
          pop()
          if(!sDamage.isPlaying()){
            sDamage.play();
          }
          dino.run = false;
        }
      }
    }
}
