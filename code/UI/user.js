

class User{
  constructor(){
    // setCookie("highScore", "Hugo:166 Bink:144 Midas:133")
    this.highScore = 0;
    this.lowScore = Infinity;
    this.highScoreData = {}
    this.localHighScore = 0;
    let buff = getCookie("highScore");
    buff = buff.split(" ");
    for(var i = 0; i<buff.length; i++){
      let user = buff[i].split(":");
      this.highScoreData[user[0]] = int(user[1])
      if(this.highScore < int(user[1])){
        this.highScore = int(user[1])
      }
      if(this.lowScore > int(user[1])){
        this.lowScore = int(user[1])
      }
    }
    this.game;
    this.reset();
    this.name = "";
    this.inp = true;
    this.inputBox = new InputBox(width/2-200, height/2);
    this.return = false;
  }

  reset(){
    this.game = new Game(true, false);
  }

  update(){
    if(this.name == ""){
      background(0);
    }else{
      this.inputBox = NaN;
    }
    if(!this.game.isDeath() && this.name != ""){
      this.game.update()
    }
  }

  changeGameState(){
    return this.return;
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
    if(key == "r" && this.name!=""){
      this.return = new User()
    }
    if(key == "m" && this.name!=""){
      this.return = new Menu()
    }
  }
}

function setCookie(cname, cvalue) {
  console.log(cname, cvalue)
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
