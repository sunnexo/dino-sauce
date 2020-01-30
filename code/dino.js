
class Dino{
  constructor(){
    this.run = true;
    this.isJumping = 0;
    this.score = 0;
    this.dy = height*-0.18
    this.dx = -this.dy*0.875
    // this.dx = 80*1.1;
    // this.dy = -100*1.1;
    this.x = 120;
    this.y = Game.ground();
    this.yVell = 0;
    this.grav = -1.9;
  }

  update(){
    if(this.y > Game.ground()){
      sLand.play()
      this.isJumping = 0;
    }
    if(this.y >= Game.ground()){
      this.y = Game.ground();
    }
    if(this.yVell >= 0 && this.y >= Game.ground()){
      this.yVell = 0;
    }else{
      this.yVell = this.yVell - this.grav;
    }
    this.y += this.yVell;
  }

  render(){
    fill(200, 100, 0);
    if(this.isJumping === 0){
      image(iPlayerStand, this.x, this.y, this.dx, this.dy)
    }else{
      image(iPlayerJump, this.x, this.y, this.dx, this.dy)
    }
  }

  jump(){
    if(this.y >= Game.ground() || this.isJumping < 2){
      this.isJumping++;
      this.yVell = -35
      sJump.play();
    }
  }
}
