
class Dino{
  constructor(){
    this.run = true;
    this.isJumping = 0;
    this.score = 0;
    this.dy = height*-0.18
    this.dx = -this.dy*0.875
    this.x = 120;
    this.y = Game.ground();
    this.yVell = 0;
    this.grav = -1.9;
  }

  update(){
    this.move();
    if(this.jump>0){
      this.dx = -this.dy*0.8
    }else{
      this.dx = -this.dy*0.875
    }

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
    if(this.isJumping == 0){
      image(iPlayerStand, this.x, this.y, this.dx, this.dy)
    }else{
      image(iPlayerJump, this.x, this.y, this.dx, this.dy)
    }
    push()
    noFill()
    strokeWeight(4);
    stroke(255, 204, 100);
    rect(this.x, this.y, this.dx, this.dy)
    pop()
  }

  jump(){
    if(this.y >= Game.ground() || this.isJumping < 2){
      this.isJumping++;
      this.yVell = -35;
      sJump.play();
    }
  }

  move(){
    if(keyIsDown(97) || keyIsDown(65)){
      this.x -= 7;
    }else if(keyIsDown(100) || keyIsDown(68)){
      this.x += 5;
    }
  }
}
