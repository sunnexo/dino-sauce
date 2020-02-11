class Genome {
  constructor() {
    this.PROBABILITY_PERTURBING = 0.9;

    this.connections = {};
    this.nodes = {};
    this.nodeCounter = new Counter();
    this.connectionCounter = new Counter();
    this.feedCounter = 0;
    this.looped = false;
  }

  init(inputs, outputs) {
    for (let i = 0; i < inputs; i++) {
      let node = new Node("INPUT", this.nodeCounter.getInnovation());
      this.addNodeGene(node);
    }
    for (let i = 0; i < outputs; i++) {
      let node = new Node("OUTPUT", this.nodeCounter.getInnovation());
      this.addNodeGene(node);
    }
    for (let inID in this.nodes) {
      if (this.nodes[inID].type == "INPUT") {
        for (let outID in this.nodes) {
          if (this.nodes[outID].type == "OUTPUT") {
            this.addConnectionGene(new Connection(int(inID), int(outID), Math.random() * 4 - 2, true, this.connectionCounter.getInnovation()))
          }
        }
      }
    }
    return this
  }

  addNodeGene(gene) {
    this.nodes[gene.id] = gene;
  }

  addConnectionGene(gene) {
    this.connections[gene.innovation] = gene;
  }

  feed(inputs){
    let outputs = [];
    for (let inID in this.nodes) {
      if (this.nodes[inID].type == "INPUT") {
        this.nodes[inID].setVal(inputs[int(inID)]);
      }
    }
    for(let outID in this.nodes){
      if(this.nodes[outID].type == "OUTPUT"){
        this.feedCounter = 0;
        outputs.push(this.feedNode(outID));
      }
    }
    for(let node_id in this.nodes){
      this.nodes[node_id].reset();
    }
    return outputs;
  }

  feedNode(node_id){
    if(this.nodes[node_id].gotOuput==true){
      return this.nodes[node_id].getOutput();
    }
    var val = 0;
    for(let con_id in this.connections){
      let con = this.connections[con_id];
      if(con.outNode == node_id && con.expressed){
        this.feedCounter++;
        if(this.feedCounter>1000){
          console.log(this.connections);
          return 0
        }
        if(this.nodes[con.inNode].type == "INPUT"){
          this.nodes[node_id].feed(con.feed(this.nodes[con.inNode].val));
        }else{
          this.nodes[node_id].feed(con.feed(this.feedNode(con.inNode)));
        }
      }
    }
    this.gotOutput = true;
    return this.nodes[node_id].getOutput();
  }

  mutate() {
    for (let conID in this.connections) {
      let con = this.connections[conID];
      if (Math.random() < this.PROBABILITY_PERTURBING) {
        con.weight *= Math.random() * 4 - 2; // TODO: adjust those values.
        // con.weight += Math.random() - 0.5; // TODO: adjust those values.
      } else {
        con.weight = Math.random() * 2 - 1;
      }
    }
    for (let nodeID in this.nodes) {
      let node = this.nodes[nodeID];
      if (Math.random() < this.PROBABILITY_PERTURBING) {
        // node.bias *= Math.random() * 4 - 2; // TODO: adjust those values.
        node.bias += Math.random() - 0.5; // TODO: adjust those values.
        console.log(node.bias)
      } else {
        node.bias = Math.random() * 2 - 1;
      }
    }
  }

  addConectionMutation(maxAttemps = 100) {
    let tries = 0;
    let success = false;
    while (tries < maxAttemps && success == false) {
      tries++;
      let node1 = this.nodes[round(random(0, Object.keys(this.nodes).length - 1))];
      let node2 = this.nodes[round(random(0, Object.keys(this.nodes).length - 1))];
      let weight = Math.random() * 2 - 1;

      let isOkay = false;
      let reversed = false;
      if (node1.type == "HIDDEN" && node2.type == "INPUT") {
        reversed = true;
        isOkay = true;
      } else if (node1.type == "OUTPUT" && node2.type == "HIDDEN") {
        reversed = true;
        isOkay = true;
      } else if (node1.type == "OUTPUT" && node2.type == "INPUT") {
        reversed = true;
        isOkay = true;
      }

      let connectionExists = false;
      for (let con in this.connections) {
        if (this.connections[con].inNode === node1.id && this.connections[con].outNode === node2.id) {
          connectionExists = true;
          break;
        } else if (this.connections[con].inNode === node2.id && this.connections[con].outNode === node1.id) {
          connectionExists = true;
          break;
        }
      }

      let connectionImpossible = false;
      if (node1.type == "INPUT" && node2.type == "INPUT") {
        connectionImpossible = true;
      } else if (node1.type == "OUTPUT" && node2.type == "OUTPUT") {
        connectionImpossible = true;
      } else if (node1.id == node2.id){
        connectionImpossible = true;
      }
      if (connectionExists || connectionImpossible) {
        continue;
      }

      let newConnection = new Connection(reversed ? node2.id : node1.id, reversed ? node1.id : node2.id, weight, true, this.connectionCounter.getInnovation());
      this.connections[newConnection.innovation] = newConnection;
      if(this.checkIfNoLoop() && !isOkay){
        delete this.connections[this.connectionCounter.dec()];
        // console.log(Object.assign({}, this.connections), newConnection)
        continue;
      }
      success = true;
    }
    if (success == false) {
      console.log("Tried, but could not add more connections");
    }
  }


  checkIfNoLoopFF(node_id, sended_ids=[]){
    if(node_id in sended_ids || this.looped){
      this.looped = true;
      return 0
    }
    sended_ids.push(int(node_id));
    if(this.nodes[node_id].gotOuput==true){
      return this.nodes[node_id].getOutput();
    }
    var val = 0;
    for(let con_id in this.connections){
      let con = this.connections[con_id];
      if(con.outNode == node_id){ //TODO: working on!!!
        if(this.nodes[con.inNode].type == "INPUT"){
          this.nodes[node_id].feed(con.feed(this.nodes[con.inNode].val));
        }else{
          if(!this.looped){
            this.nodes[node_id].feed(con.feed(this.checkIfNoLoopFF(con.inNode, sended_ids)));
          }
        }
      }
    }
    this.gotOutput = true;
    return this.nodes[node_id].getOutput();
  }

  checkIfNoLoop(){
    this.looped = false;
    for (let inID in this.nodes) {
      if (this.nodes[inID].type == "INPUT") {
        this.nodes[inID].setVal(0);
      }
    }
    for(let outID in this.nodes){
      if(this.nodes[outID].type == "OUTPUT"){
        this.feedCounter = 0;
        this.checkIfNoLoopFF(outID);
      }
    }
    return this.looped;
  }

  addNodeMutation() {
    let r = round(random(0, Object.keys(this.connections).length - 1))
    let con = this.connections[r];
    let cin = con.inNode;
    let inNode = this.nodes[cin];
    let outNode = this.nodes[con.outNode];

    con.disable();

    let newNode = new Node("HIDDEN", this.nodeCounter.getInnovation());
    let inToNew = new Connection(inNode.id, newNode.id, 1, true, this.connectionCounter.getInnovation());
    let newToOut = new Connection(newNode.id, outNode.id, con.weight, true, this.connectionCounter.getInnovation());
    this.nodes[newNode.id] = newNode;
    this.connections[inToNew.innovation] = inToNew;
    this.connections[newToOut.innovation] = newToOut;
  }


  /**
   * @param parent1  More fit parent
   * @param parent2  Less fit parent
   */
  static crossover(parent1, parent2) {
    let child = new Genome();

    for (let parent1NodeId in parent1.nodes) {
      child.addNodeGene(parent1.nodes[parent1NodeId].copy());
    }

    for (let parent1NodeId in parent1.connections) {
      if (parent1.connections[parent1NodeId].innovation in parent2.connections) {
        // matching gene
        let childConGene = round(Math.random()) ? parent1.connections[parent1NodeId].copy() : parent2.connections[parent1.connections[parent1NodeId].innovation].copy();
        child.addConnectionGene(childConGene)
      } else {
        // disjoint or exess gene
        let childConGene = parent1.connections[parent1NodeId].copy();
        child.addConnectionGene(childConGene);
      }
    }
    child.nodeCounter.currentInnovation = parent1.nodeCounter.currentInnovation;
    child.connectionCounter = new Counter(parent1.connectionCounter.currentInnovation);
    return child;
  }


  static compatibilityDistance(genome1, genome2, c1, c2, c3, n_max=20) {
    var excessGenes = 0;
    var disjointGenes = 0;
    var avgWeightDiff = 0;
    var weightDifference = 0;
    var matchingGenes = 0;

    //nodes
    const nodeKeys1 = Object.keys(genome1.nodes).sort();
    const nodeKeys2 = Object.keys(genome2.nodes).sort();

    var highestInnovation1 = nodeKeys1[nodeKeys1.length - 1];
    var highestInnovation2 = nodeKeys2[nodeKeys1.length - 1];
    var indices = Math.max(int(highestInnovation1), int(highestInnovation2));

    for (var i = 0; i <= indices; i++) {
      const node1 = genome1.nodes[i];
      const node2 = genome2.nodes[i];
      if (node1 != undefined && node2 == undefined) {
        if (highestInnovation2 < i) {
          excessGenes++;
        } else {
          disjointGenes++;
        }
      } else if (node1 == undefined && node2 != undefined) {
        if (highestInnovation1 < i) {
          excessGenes++;
        } else {
          disjointGenes++;
        }
      }
    }


    const conKeys1 = Object.keys(genome1.connections).sort();
    const conKeys2 = Object.keys(genome2.connections).sort();

    highestInnovation1 = conKeys1[conKeys1.length - 1];
    highestInnovation2 = conKeys2[conKeys2.length - 1];
    indices = Math.max(int(highestInnovation1), int(highestInnovation2));

    for (var i = 0; i <= indices; i++) {
      const connection1 = genome1.connections[i];
      const connection2 = genome2.connections[i];
      if (connection1 != undefined) {
        if (connection2 != undefined) {
          matchingGenes++;
          weightDifference += abs(connection1.weight - connection2.weight);
        } else if (highestInnovation2 < i) {
          excessGenes++;
        } else {
          disjointGenes++;
        }
      } else if (connection2 != undefined) {
        if (highestInnovation1 < i) {
          excessGenes++;
        } else {
          disjointGenes++;
        }
      }
    }

    avgWeightDiff = weightDifference / matchingGenes;
    var n = max(Object.keys(genome1.nodes).length+Object.keys(genome1.connections).length, Object.keys(genome2.nodes).length+Object.keys(genome2.connections).length);
    if (n < n_max) {
      n = 1;
    }
    return (excessGenes * c1) / n + (disjointGenes * c2) / n + avgWeightDiff * c3;
  }


  copy() {
    let newGenome = new Genome();
    for (let NodeId in this.nodes) {
      newGenome.addNodeGene(this.nodes[NodeId].copy());
    }
    for (let NodeId in this.connections) {
      newGenome.addConnectionGene(this.connections[NodeId].copy());
    }
    return newGenome;
  }


  render() {
    background(170);
    textSize(30)
    for (let NodeId in this.connections) {
      let con = this.connections[NodeId];
      if (con.expressed) {
        push()
        strokeWeight(Math.max(abs(con.weight * 4), 0.5));
        if (con.weight < 0) {
          stroke(255, 0, 0)
        } else {
          stroke(0, 255, 0)
        }
        let delta = random(-20, 20)
        line(this.nodes[con.inNode].x, this.nodes[con.inNode].y, this.nodes[con.outNode].x + this.nodes[con.outNode].xDelta, this.nodes[con.outNode].y + this.nodes[con.outNode].yDelta)
        strokeWeight(4)
        point(this.nodes[con.outNode].x + this.nodes[con.outNode].xDelta, this.nodes[con.outNode].y + this.nodes[con.outNode].yDelta)
        pop()
      }
    }
    for (let NodeId in this.nodes) {
      let node = this.nodes[NodeId];
      push()
      if (node.type == "INPUT") {
        fill(100, 0, 40);
        if (Number.isNaN(node.y)) {
          node.y = height - 50;
        }
        ellipse(node.x, node.y, 50);
        fill(0)
        text(node.id, node.x-8, node.y+10);
      } else if (node.type == "OUTPUT") {
        fill(120, 0, 120);
        if (Number.isNaN(node.y)) {
          node.y = 50;
        }
        push()
        node.bias>0 ? stroke(0, 255, 0) : stroke(255, 0, 0)
        strokeWeight(Math.max(abs(node.bias*4), 0.5))
        ellipse(node.x, node.y, 50);
        pop()
        fill(0)
        text(node.id, node.x-8, node.y+10);
      } else {
        fill(0, 100, 40);
        if (Number.isNaN(node.y)) {
          node.y = random(150, height - 150);
        }
        push()
        node.bias>0 ? stroke(0, 255, 0) : stroke(255, 0, 0)
        strokeWeight(Math.max(abs(node.bias*4), 0.5))
        ellipse(node.x, node.y, 50);
        pop()
        fill(0)
        text(node.id, node.x-8, node.y+10);
      }
      pop()
    }


  }
}
