

class Menu{
  constructor(){
    this.return = false;
  }

  update(){

  }

  changeGameState(){
    return this.return;
  }

  render(){
    background(100, 0, 0);
  }

  keyHandeler(key){
    if(key==" "){
      this.return = new User();
    }else{
      this.return = false;
    }
  }
}

//
// class Button{
//   constructor(x, y, w, h)
// }
