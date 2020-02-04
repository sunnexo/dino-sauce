

class User{
  constructor(){
    this.dino;
    this.cactuses = [];
    this.highScore = 0;
    this.game;
    this.reset();
  }
  
  reset(){
    this.game = new Game(true);
  }

  update(){
    if(!this.game.isDeath()){
      this.game.update()
    }
  }

  changeGameState(){
    return false;
  }

  render(){

  }

  keyHandeler(key){
    this.game.dino.score = round(this.game.dino.score)
    if(key == " "){
      this.game.jump();
    }
    if(key == " " && this.game.isDeath()){
      this.reset()
    }
  }
}
