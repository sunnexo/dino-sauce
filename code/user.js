

class User{
  constructor(){
    // setCookie("highScore", "Teun:5 Bink:10 Hugo:15")
    this.highScore = 0;
    this.lowScore = Infinity;
    this.highScoreData = {}
    let buff = getCookie("highScore")
    buff = buff.split(" ")
    for(var i = 0; i<buff.length; i++){
      let user = buff[i].split(":")
      this.highScoreData[user[0]] = int(user[1])
      if(this.highScore < int(user[1])){
        this.highScore = int(user[1])
      }
      if(this.lowScore > int(user[1])){
        this.lowScore = int(user[1])
      }
    }
    this.dino;
    this.cactuses = [];
    this.game;
    this.reset();
    this.name = "";
    this.inp = true;
    this.inputBox = new InputBox(width/2-200, height/2);
  }

  reset(){
    this.game = new Game(true);
  }

  update(){
    if(this.name == ""){
      background(0);
    }
    if(!this.game.isDeath() && this.name != ""){
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

function setCookie(cname, cvalue) {
  var d = new Date();
  d.setTime(d.getTime() + (365*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";"
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
