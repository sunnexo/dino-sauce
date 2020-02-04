let test;
let button;
class InputBox{
  constructor(x, y){
    this.x = x;
    this.y = y;
    // this.inp = createInput("sadf");
    // this.inp.position(x, y);
    test = createInput("");
    test.position(x, y);
    button = createButton('submit');
    button.position(x + test.width, y);
    button.mousePressed(this.mousePressedButton);
  }

  mousePressedButton(){
    gameState.name = test.value();
    test.remove()
    button.remove()
  }
}
