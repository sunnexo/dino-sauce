


class Node{
  constructor(type, id, bias=0){
    this.gotOutput = false;
    this.val = 0;

    this.type = type;
    this.id = id;
    this.bias = bias;
    this.x = random(width-500, width-50);
    this.xDelta = floor(random(-10, 10));
    this.yDelta = floor(random(-10, 10));
    this.y = NaN;
  }

  copy(){
    let n = new Node(this.type, this.id, this.bias);
    n.gotOutput = this.gotOutput;
    return n;
  }

  setVal(val){
    this.val = val;
  }

  feed(val){
    this.val += val;
  }

  getOutput(){
    this.gotOutput = true;
    if(this.type == "INPUT"){
      if(this.val == NaN){
        throw new Error(this)
      }
      return this.val;
    }else{
      let out = sigmoid.func(this.val + this.bias);
      if(out == NaN){
        throw new Error(this)
      }
      return out;
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
  x => 1 / (1 + Math.exp(-4.9*x)),
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
