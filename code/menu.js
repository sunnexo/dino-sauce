

class Menu{
  constructor(){
    this.return = false;
    // this.button = new Button(width/2, height/2, 200, 200, "test");
  }

  update(){
    // if(this.button.isClick()){
    //   this.return = new User();
    // }
  }

  changeGameState(){
    return this.return;
  }

  render(){
    // this.button.render()
    background(100);
  }

  keyHandeler(key){
    if(key==" "){
      this.return = new User();
    }else{
      this.return = false;
    }
  }
}


// class Button{
//   constructor(x, y, w, h, text){
//     this.x = x;
//     this.y = y;
//     this.w = w;
//     this.h = h;
//     this.text = text;
//   }
//
//   render(){
//     // fill(100);
//     // if(mouseX < this.x+this.w && mouseX > this.x){
//     //   if(mouseY < this.y - this.h && mouseY > this.y){
//     //     push()
//     //     fill(255, 0, 0);
//     //     pop()
//     //   }
//     // }
//     // textSize(this.h/2);
//     // text(this.text, this.x+10, this.y-10);
//     console.log(this)
//     fill(100, 255, 0)
//     rect(this.x, this.y, this.w, this.h);
//
//   }
//
//   isClick(){
//     if(mouseIsPressed && mouseX < this.x+this.w && mouseX > this.x){
//       if(mouseY < this.y - this.h && mouseY > this.y){
//         return true;
//       }
//     }
//     return false;
//   }
// }
