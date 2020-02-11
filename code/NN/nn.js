
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
//
// let relu = new ActivationFunction(
//   x => max(0, x),
//   y => 1 - (y * y)
// );


class NeuralNetwork {
  /*
  * if first argument is a NeuralNetwork the constructor clones it
  * USAGE: cloned_nn = new NeuralNetwork(to_clone_nn);
  */
  constructor(in_nodes, hid_nodes, out_nodes) {
    if (in_nodes instanceof NeuralNetwork) {
      let a = in_nodes;
      this.input_nodes = a.input_nodes;
      this.hidden_nodes = a.hidden_nodes;
      this.output_nodes = a.output_nodes;

      this.weights_ih = a.weights_ih.copy();
      this.weights_ho = a.weights_ho.copy();

      this.bias_h = a.bias_h.copy();
      this.bias_o = a.bias_o.copy();
    } else {
      this.input_nodes = in_nodes;
      this.hidden_nodes = hid_nodes;
      this.output_nodes = out_nodes;

      this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
      this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
      this.weights_ih.randomize();
      this.weights_ho.randomize();

      this.bias_h = new Matrix(this.hidden_nodes, 1);
      this.bias_o = new Matrix(this.output_nodes, 1);
      this.bias_h.randomize();
      this.bias_o.randomize();
    }

    // TODO: copy these as well
    this.setLearningRate();
    this.setActivationFunction();


  }

  predict(input_array) {

    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);

    // activation function
    hidden.map(sigmoid.func);

    // Generating the output's output
    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(sigmoid.func);

    // Sending back to the caller
    return output.toArray();
  }

  setLearningRate(learning_rate = 0.01) {
    this.learning_rate = learning_rate;
  }

  setActivationFunction(func = tanh) {
    this.activation_function = func;
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
    nn.weights_ih = Matrix.deserialize(data.weights_ih);
    nn.weights_ho = Matrix.deserialize(data.weights_ho);
    nn.bias_h = Matrix.deserialize(data.bias_h);
    nn.bias_o = Matrix.deserialize(data.bias_o);
    nn.learning_rate = data.learning_rate;
    return nn;
  }


  static crossOver(p){
    let newNN = new NeuralNetwork(p[0].nn.input_nodes, p[0].nn.hidden_nodes, p[0].nn.output_nodes)
    let pLen = p.length;
    let parents = [];
    for(let per of p){
      per.nn = per.nn.copy();
      parents.push(per);
    }
    newNN.weights_ih.map(function (val, i, j) {
      return parents[int(round(random(0, pLen-1)))].nn.weights_ih.data[i][j];
    });
    newNN.weights_ho.map(function (val, i, j) {
      return parents[round(random(0, pLen-1))].nn.weights_ho.data[i][j];
    });
    newNN.bias_h.map(function (val, i, j) {
      return parents[round(random(0, pLen-1))].nn.bias_h.data[i][j];
    });
    newNN.bias_o.map(function (val, i, j) {
      return parents[round(random(0, pLen-1))].nn.bias_o.data[i][j];
    });
    return newNN;
  }


  // Adding function for neuro-evolution
  copy() {
    return new NeuralNetwork(this);
  }

  // Accept an arbitrary function for mutation
  mutate(rate, change=0.1) {
    function mutate(val) {
      if (Math.random() < rate) {
        return val + randomGaussian(0, change);
      // }else if (Math.random() < rate/100) {
      //   return 2 * Math.random() - 1;
      }else {
        return val;
      }
    }
    this.weights_ih.map(mutate);
    this.weights_ho.map(mutate);
    this.bias_h.map(mutate);
    this.bias_o.map(mutate);
  }
}
