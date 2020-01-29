
class Dino{
  var ground = height-30;
  let dx = 20;
  let dy = 30;
  let x = 30;
  let y = height-40;
  let yVel = 0;
  let grav = 0.4;

  update(){
    if(yVel <= 0 && y > ground){
      yVell = 0;
    }else{
      yVell -= grav;
    }
    y += yVel;
  }

  render(){
    fill(200, 100, 0);
    rect(x, y, dx, dy);
  }

  jump(){
    if(this.y >= this.ground){
      yVel = 9;
    }
  }

}
