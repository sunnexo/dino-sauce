class Dino{
    constructor(){
      this.ground = 500 - 30
      this.dx = 20;
      this.dy = 30;
      this.x = 30;
      this.y = height-40;
      this.yVel = 0;
      this.grav = 0.4;
    }
  
    update(){
      if(this.yVel <= 0 && this.y > this.ground){
        this.yVell = 0;
      }else{
        this.yVell -= this.grav;
      }
      this.y += this.yVel;
    }
  
    render(){
      fill(200, 100, 0);
      rect(this.x, this.y, this.dx, this.dy);
    }
  
    jump(){
      if(this.y >= this.ground){
        this.yVel = 9;
      }
    }
  
  }