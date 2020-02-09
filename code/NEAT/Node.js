


class Node{
  constructor(type, id){
    this.type = type;
    this.id = id;
    this.x = random(50, width-50);
    this.xDelta = floor(random(-10, 10));
    this.yDelta = floor(random(-10, 10));
    this.y = NaN;
  }

  copy(){
    return new Node(this.type, this.id);
  }
}
