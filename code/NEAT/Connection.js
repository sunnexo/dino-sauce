


class Connection{

  constructor(inNode, outNode, weight, expressed, innovation){
    this.inNode = inNode;
    this.outNode = outNode;
    this.weight = weight;
    this.expressed = expressed;
    this.innovation = innovation;
  }

  disable(){
    this.expressed = false;
  }

  copy(){
    return new Connection(
      this.inNode,
      this.outNode,
      this.weight,
      this.expressed,
      this.innovation
    );
  }

  feed(val){
    if(this.expressed){
      return val*this.weight;
    }else{
      return 0
    }
  }
}
