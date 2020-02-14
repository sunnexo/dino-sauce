


class Node{
  constructor(type, id, bias=0){
    this.gotOutput = false;
    this.val = 0;

    this.type = type;
    this.id = id;
    this.bias = bias;
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
    this.val += val;
  }

  getOutput(){
    if(this.type == "INPUT"){
      return this.val;
    }else{
      return sigmoid.func(this.val + this.bias);
    }
  }

  reset(){
    this.gotOutput = false;
    this.val = 0;
  }
}



class ActivationFunction {
  constructor(func, dfunc) {
    this.func = func;
    this.dfunc = dfunc;
  }
}

let sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);

let tanh = new ActivationFunction(
  x => Math.tanh(x),
  y => 1 - (y * y)
);

let relu = new ActivationFunction(
  x => max(0, x),
  y => 1 - (y * y)
);
