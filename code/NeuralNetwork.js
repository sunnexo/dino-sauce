
// class ActivationFunction {
//   constructor(func, dfunc) {
//     this.func = func;
//     this.dfunc = dfunc;
//   }
// }
//
// let sigmoid = new ActivationFunction(
//   x => 1 / (1 + Math.exp(-x)),
//   y => y * (1 - y)
// );
//
// let tanh = new ActivationFunction(
//   x => Math.tanh(x),
//   y => 1 - (y * y)
// );


class Node{
  constructor(id, cameFrom, weights, isInput=false){
    this.ID = id;
    this.isInput = isInput;
    if(!isInput){
      this.conectedTo = cameFrom;
      this.weights = weights;
      for(let i = 0; i < weights.length; i++){
        weights[i].to = this;
        weights[i].from = cameFrom[i];
      }
      this.bias = Math.random() * 2 - 1;
    }
    this.val = 0;
  }
  add(change){
    this.bias += change;
  }
  feed(){
    if(this.isInput){
      return this.val;
    }else{
      let this.val = 0;
      for(var i = 0; i < this.conectedTo.length; i++){
        this.val += this.weights[i].feed(this.conectedTo[i].feed());
      }
      this.val += this.bias;
      return sigmoid.func(val);
    }
  }
}

class Weight{
  constructor(weight=NaN){
    if(weight == NaN){
      this.weight = weight;
    }else{
      this.weight = Math.random() * 2 - 1;
    }
    this.enabled = true;
    this.from;
    this.to;
  }
  add(change){
    this.weight += change;
  }
  feed(input){
    if(this.enabled){
      return input*this.weight;
    }else{
      return 0;
    }
  }
}

class NEAT{
  constructor(input_nodes, output_nodes){
    this.inputs_nodes = [];
    this.output_nodes = [];
    this.idCounter = 0;
    let idCounter = 0;
    for(var i = 0; i < input_nodes; i++){
      this.inputs_nodes.push(new Node(this.idCounter, NaN, NaN, true))
      this.idCounter++;
    }
    for(var i = 0; i < output_nodes; i++){
      let weights = []
      for(var j = 0; j < input_nodes; j++){
        weights.push(new Weight())
      }
      this.output_nodes.push(new Node(this.idCounter, this.inputs_nodes, weights))
      this.idCounter++;
    }
    this.hidden_nodes = [];
    this.hiddenOut_nodes = this.inputs_nodes;
  }

  addNode(){
    let howManyWeights = 0;
    let node = NaN;
    let nodeFrom = this.hiddenIn_nodes[round(random(0, this.hiddenIn_nodes.length))
    for(let node of hidden_nodes){
      howManyWeights += node.weights.length;
    }for(let node of output_nodes){
      howManyWeights += node.weights.length;
    }


    node = new Node(this.idCounter, nodeFrom]);
    this.hidden_nodes.push(node);
    this.hiddenIn_nodes.push(node);
    this.idCounter++;
  }

  delNode(){

  }

  addWeight(){


  }

  delWeight(){

  }

  mutate(){

  }

  crossOver(){

  }

  render(){
    background(0);
    console.log(this.inputs_nodes, this.output_nodes);
  }
}
