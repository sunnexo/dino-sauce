
class Dino{
  constructor(test){
    this.ground = height
    this.dx = 40;
    this.dy = 50;
    this.x = 30;
    this.y = height - 190;
    this.yVell = 0;
    this.grav = -0.4;
  }

  update(){
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
    console.log(this.y, this.yVell)
    fill(200, 100, 0);
    rect(this.x, this.y, this.dx, -this.dy);
  }

  jump(){
    if(this.y >= this.ground){
      this.yVell = -12;
    }
  }

}
