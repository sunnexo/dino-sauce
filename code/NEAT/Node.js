


class Node{

  constructor(type, id){
    this.type = type;
    this.id = id;
    this.x = random(50, width-50);
    this.xDelta = floor(random(-20, 20));
    this.yDelta = floor(random(-20, 20));
    this.y = NaN;
  }

  copy(){
    return new Node(this.type, this.id);
  }
}
