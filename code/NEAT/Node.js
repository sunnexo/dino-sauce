


class Node{
  constructor(type, id, cameFrom=[], bias=0){
    this.type = type;
    this.id = id;
    this.bias = bias;
    this.cameFrom = cameFrom;
    this.val = 0;
    this.x = random(50, width-50);
    this.xDelta = floor(random(-10, 10));
    this.yDelta = floor(random(-10, 10));
    this.y = NaN;
  }

  copy(){
    return new Node(this.type, this.id, this.bias);
  }

  setVal(val){
    this.val = val;
  }

  feed(val){
    return val + this.bias;
  }

  reset(){
    this.val = 0;
  }
}
