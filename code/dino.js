
class Dino{
  constructor(){
    this.run = true;
    this.score = 0;
    this.ground = height;
    this.dx = 80;
    this.dy = -100;
    this.x = 30;
    this.y = this.ground;
    this.yVell = 0;
    this.grav = -1.7;
  }

  update(){
    if(this.y > this.ground){
      sLand.play()
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
    rect(this.x, this.y, this.dx, this.dy);
  }

  jump(){
    if(this.y >= this.ground){
      this.yVell = -30;
      sJump.play();
    }
  }

  reset(){
    this.score = 0;
    this.ground = height;
    this.dx = 80;
    this.dy = -100;
    this.x = 30;
    this.y = this.ground;
    this.yVell = 0;
    this.grav = -1.7;
  }

}
