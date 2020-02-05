

class Menu{
  constructor(){
    this.return = false;
    this.AIButton = new Button(width/3-200, height/2-100, 400, 200, "AI", 165, color("BLUE"));
    this.UserButton = new Button(width-width/3-200, height/2-100, 400, 200, "USER", 65, color("GREEN"));
  }

  update(){
    if(this.UserButton.isClick()){
      this.return = new User();
    }if(this.AIButton.isClick()){
      this.return = new AI();
    }
  }

  changeGameState(){
    return this.return;
  }

  render(){
    background(100);
    this.UserButton.render()
    this.AIButton.render()
  }

  keyHandeler(key){
    // if(key==" "){
    //   this.return = new User();
    // }else{
    //   this.return = false;
    // }
  }
}


class Button{
  constructor(x, y, w, h, text, textX, color){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.textX = textX;
    this.color = color;
    console.log(x, y, w, h)
  }

  render(){
    fill(0);
    if(mouseX < this.x+this.w && mouseX > this.x && mouseY > this.y && mouseY < this.y + this.h){
      fill(255, 0, 0);
    }else{
      fill(this.color)
    }
    rect(this.x, this.y, this.w, this.h);
    fill(0)
    textSize(this.h/2);
    text(this.text, this.x+this.textX, this.y+130);
  }

  isClick(){
    if(mouseIsPressed && mouseX < this.x+this.w && mouseX > this.x){
      if(mouseY > this.y && mouseY < this.y + this.h){

        return true;
      }
    }
    return false;
  }
}
