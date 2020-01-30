
class Dino{
  constructor(){
    this.run = true;
    this.isJumping = 0;
    this.score = 0;
    this.ground = height;
    this.dx = width*0.0733333
    this.dy = height*-0.22
    // this.dx = 80*1.1;
    // this.dy = -100*1.1;
    this.x = 100;
    this.y = this.ground;
    this.yVell = 0;
    this.grav = -1.7;
  }

  update(){
    if(this.y > this.ground){
      sLand.play()
      this.isJumping = 0;
    }
    if(this.y >= this.ground){
      this.y = this.ground;
    }
    if(this.yVell >= 0 && this.y >= this.ground){
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
    if(this.y >= this.ground || this.isJumping < 2){
      this.isJumping++;
      this.yVell = -34
      sJump.play();
    }
  }
}
