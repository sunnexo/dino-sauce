
class Node{
  constructor(id, cameFrom, weights, isInput=false){
    this.ID = id;
    this.isInput = isInput;
    if(!isInput){
      this.cameFrom = cameFrom;
      this.weights = weights;
      for(let i = 0; i < weights.length; i++){
        weights[i].to = this;
        weights[i].from = cameFrom[i];
      }
      // this.bias = Math.random() * 2 - 1;
      this.bias = 0;
    }else{
      this.cameFrom = NaN;
      this.weights = NaN;
      this.bias = NaN;
    }
    this.val = 0;
  }
  add(change){
    this.bias += change;
  }
  feed(loopArr=NaN){
    // TODO: make a system so it can detect when it's in a loop.
    if(this.isInput){
      return this.val;
    }else{
      this.val = 0;
      for(var i = 0; i < this.cameFrom.length; i++){
        this.val += this.weights[i].feed(this.cameFrom[i].feed());
      }
      this.val += this.bias;
      // if(loopArr==NaN){
      //   return [sigmoid.func(this.val), [this]];;
      // }
      // if(loopArr == true){
      //   return [sigmoid.func(this.val), true];
      // }
      // if(loopArr == false){
      //   return [sigmoid.func(this.val), false];
      // }
      // if(loopArr!=NaN && loopArr.includes(this)){
      //   return [sigmoid.func(this.val), true];
      // }
      // loopArr.push(this);
      // return [sigmoid.func(this.val), loopArr];
      return sigmoid.func(this.val);
    }
  }


}

class Weight{
  constructor(weight=NaN){
    if(weight == NaN){
      this.weight = weight;
    }else{
      // this.weight = Math.random() * 2 - 1;
      this.weight = 1 ;
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
    this.input_nodes = [];
    this.output_nodes = [];
    this.allWeights = [];
    this.idCounter = 0;
    let idCounter = 0;
    for(var i = 0; i < input_nodes; i++){
      this.input_nodes.push(new Node(this.idCounter, NaN, NaN, true))
      this.idCounter++;
    }
    for(var i = 0; i < output_nodes; i++){
      let weights = []
      for(var j = 0; j < input_nodes; j++){
        let weight = new Weight();
        this.allWeights.push(weight)
        weights.push(weight)
      }
      this.output_nodes.push(new Node(this.idCounter, [...this.input_nodes], weights))
      this.idCounter++;
    }
    this.hidden_nodes = [];
    this.mutateRate = 0.1;
    this.nodeMutation = 0.02;
    this.weightMutation = 0.03;
    this.mutateChange = 0.1;
  }

  setMutateRate(dict){
    this.mutateRate = dict.mutate_rate;
    this.nodeMutation = dict.add_node_rate;
    this.weightMutation = dict.add_weight_rate;
    this.mutateChange = dict.mutate_change;
  }

  addNode(){
    let howManyWeights = 0;
    let node = NaN;
    let buff = [];
    for(let w of this.allWeights){
      if(w.enabled){
        buff.push(w);
      }
    }
    let inWeight = buff[round(random(0, buff.length-1))]
    inWeight.enabled = false;
    let weight1 = new Weight()
    let weight2 = new Weight()
    node = new Node(this.idCounter, [inWeight.from], [weight1]);
    weight2.to = inWeight.to;
    weight2.from = node;
    weight2.weight = inWeight.weight;
    this.allWeights.push(weight2)
    this.allWeights.push(weight1)
    this.hidden_nodes.push(node);
    this.idCounter++;
  }


  addWeight(){
    let states = true;
    let newWeight;
    let counter = 0;
    while(states){
      counter++;
      if(counter>3){
        states = false;
      }
      try{
        newWeight = new Weight();
        let buff = [...this.hidden_nodes, ...this.input_nodes];
        newWeight.from = buff[round(random(0, buff.length-1))];
        buff = [...this.hidden_nodes, ...this.output_nodes];
        let state = true;
        while(newWeight.to === newWeight.from || state){
          newWeight.to = buff[round(random(0, buff.length-1))];
          for(let weight of this.allWeights){
            if(weight.from === newWeight.from || weight.to === newWeight.to){
            }else{
              state = false;
            }
          }
        }
        newWeight.to.weights.push(newWeight);
        newWeight.to.cameFrom.push(newWeight.from);
        this.allWeights.push(newWeight);
        this.predict(new Array(this.input_nodes.length).fill(0));
        states = false;
      }catch(e){
        newWeight.to.weights.pop();
        newWeight.to.cameFrom.pop();
        this.allWeights.pop();
        // delete newWeight;
      }
    }



  }

  delWeight(){
    // TODO: add this function for mutation
  }

  predict(inputs){
    var outputs = []
    for(var i = 0; i < inputs.length; i++){
      this.input_nodes[i].val = inputs[i]
    }
    for(let node of this.output_nodes){
      outputs.push(node.feed());
    }
    return outputs
  }

  mutate(){
    function mutate(val){
      if(Math.random() < this.mutateRate){
        return val + randomGaussian(0,this.mutateChange)
      }
    }
  }

  crossOver(){

  }

  render(){
    background(0);
    console.log(this.input_nodes, this.hidden_nodes, this.output_nodes, this.allWeights);
  }
}
