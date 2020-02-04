

class Menu{
  constructor(){
    this.return = false;
    this.button = new Button(width/2, height/2, 200, 200, "test");
  }

  update(){
    if(this.button.isClick()){
      this.return = new User();
    }
  }

  changeGameState(){
    return this.return;
  }

  render(){
    background(100);
    this.button.render()
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
  constructor(x, y, w, h, text){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
  }

  render(){
    fill(0);
    if(mouseX < this.x+this.w && mouseX > this.x && mouseY > this.y && mouseY < this.y + this.h){
      fill(255, 0, 0);
    }else{
      fill(100, 255, 0)
    }
    rect(this.x, this.y, this.w, this.h);
    fill(0)
    textSize(this.h/2);
    text(this.text, this.x+10, this.y+130);

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
