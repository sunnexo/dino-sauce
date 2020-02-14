class Genome {
  constructor() {
    this.PROBABILITY_PERTURBING = 0.9;
    this.id = random();
    this.connections = new Map();
    this.nodes = new Map();
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
    for (let [inID, inNode] of this.nodes) {
      if (inNode.type == "INPUT") {
        for (let [outID, outNode] of this.nodes) {
          if (outNode.type == "OUTPUT") {
            this.addConnectionGene(new Connection(int(inID), int(outID), Math.random() * 4 - 2, true, this.connectionCounter.getInnovation()))
          }
        }
      }
    }
    return this;
  }

  addNodeGene(gene) {
    this.nodes.set(gene.id, gene);
  }

  addConnectionGene(gene) {
    this.connections.set(gene.innovation, gene);
  }

  feed(inputs) {
    let outputs = [];
    for (let [inID, outNode] of this.nodes) {
      if (outNode.type == "INPUT") {
        outNode.setVal(inputs[int(inID)]);
      }
    }
    for (let [outID, outNode] of this.nodes) {
      if (outNode.type == "OUTPUT") {
        this.feedCounter = 0;
        outputs.push(this.feedNode(outID));
      }
    }
    for (let [node_id, node] of this.nodes) {
      node.reset();
    }
    return outputs;
  }

  feedNode(node_id) {
    let node = this.nodes.get(node_id);
    if (node.gotOuput == true) {
      return node.getOutput();
    }
    var val = 0;
    for (let [con_id, con_val] of this.connections) {
      let con = con_val;
      if (con.outNode == node_id && con.expressed) {
        this.feedCounter++;
        if (this.feedCounter > 1000) {
          console.log(this.connections);
          return 0
        }
        if (node.type == "INPUT") {
        node.feed(con.feed(this.nodes.get(con.inNode).val));
      } else {
        node.feed(con.feed(this.feedNode(con.inNode)));
      }
    }
  }
  this.gotOutput = true;
  return node.getOutput();
}

mutate() {
  for (let [conID, conVal] of this.connections) {
    let con = conVal;
    if (Math.random() < this.PROBABILITY_PERTURBING) {
      con.weight *= Math.random() * 4 - 2; // TODO: adjust those values.
      // con.weight += Math.random() - 0.5; // TODO: adjust those values.
    } else {
      con.weight = Math.random() * 2 - 1;
    }
  }
  for (let [nodeID, node] of this.nodes) {
    if (Math.random() < this.PROBABILITY_PERTURBING) {
      // node.bias *= Math.random() * 4 - 2; // TODO: adjust those values.
      node.bias += Math.random() - 0.5; // TODO: adjust those values.
    } else {
      node.bias = Math.random() * 2 - 1;
    }
  }
}

addConectionMutation(maxAttemps = 20) {
  let tries = 0;
  let success = false;
  while (tries < maxAttemps && success == false) {
    tries++;
    let node1 = this.nodes.get(round(random(0, this.nodes.size - 1)));
    let node2 = this.nodes.get(round(random(0, this.nodes.size - 1)));
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
    for (let [con_id, con] of this.connections) {
      if (con.inNode === node1.id && con.outNode === node2.id) {
        connectionExists = true;
        break;
      } else if (con.inNode === node2.id && con.outNode === node1.id) {
        connectionExists = true;
        break;
      }
    }

    let connectionImpossible = false;
    if (node1.type == "INPUT" && node2.type == "INPUT") {
      connectionImpossible = true;
    } else if (node1.type == "OUTPUT" && node2.type == "OUTPUT") {
      connectionImpossible = true;
    } else if (node1.id == node2.id) {
      connectionImpossible = true;
    }
    if (connectionExists || connectionImpossible) {
      continue;
    }

    let newConnection = new Connection(reversed ? node2.id : node1.id, reversed ? node1.id : node2.id, weight, true, this.connectionCounter.getInnovation());
    this.connections.set(newConnection.innovation, newConnection);
    if (this.checkIfNoLoop() && !isOkay) {
      this.connections.delete(this.connectionCounter.dec());
      // console.log(Object.assign({}, this.connections), newConnection)
      continue;
    }
    success = true;
  }
  if (success == false) {
    // console.log("Tried, but could not add more connections");
  }
}


checkIfNoLoopFF(node_id, sended_ids = []) {
  let node = this.nodes.get(node_id);
  if (node_id in sended_ids || this.looped) {
    this.looped = true;
    return 0
  }
  sended_ids.push(int(node_id));
  if (node.gotOuput == true) {
    return node.getOutput();
  }
  var val = 0;
  for (let [con_id, con] in this.connections) {
    // let con = this.connections[con_id];
    if (con.outNode == node_id) { //TODO: working on!!!
      if (this.nodes[con.inNode].type == "INPUT") {
        node.feed(con.feed(this.nodes[con.inNode].val));
      } else {
        if (!this.looped) {
          node.feed(con.feed(this.checkIfNoLoopFF(con.inNode, sended_ids)));
        }
      }
    }
  }
  this.gotOutput = true;
  return node.getOutput();
}

checkIfNoLoop() {
  this.looped = false;
  for (let [inID, inNode] of this.nodes) {
    if (inNode.type == "INPUT") {
      inNode.setVal(0);
    }
  }
  for (let [outID, outNode] of this.nodes) {
    if (outNode.type == "OUTPUT") {
      this.feedCounter = 0;
      this.checkIfNoLoopFF(outID);
    }
  }
  return this.looped;
}

addNodeMutation() {
  const r = round(random(0, this.connections.size - 1))
  const con = this.connections.get(r);
  const inNode = this.nodes.get(con.inNode);
  const outNode = this.nodes.get(con.outNode);

  con.disable();

  const newNode = new Node("HIDDEN", this.nodeCounter.getInnovation());
  const inToNew = new Connection(inNode.id, newNode.id, 1, true, this.connectionCounter.getInnovation());
  const newToOut = new Connection(newNode.id, outNode.id, con.weight, true, this.connectionCounter.getInnovation());
  this.nodes.set(newNode.id, newNode);
  this.connections.set(inToNew.innovation, inToNew);
  this.connections.set(newToOut.innovation, newToOut);
}


/**
 * @param parent1  More fit parent
 * @param parent2  Less fit parent
 */
static crossover(parent1, parent2) {
  let child = new Genome();
  // console.log(parent1.nodeCounter.currentInnovation, parent1.connectionCounter.currentInnovation)
  for (let [parent1NodeId, parent1Node] of parent1.nodes) {
    child.addNodeGene(parent1Node.copy());
    // child.nodeCounter.getInnovation();
  }

  for (let [parent1ConId, parent1Con] of parent1.connections) {
    if (parent1Con.innovation in parent2.connections && parent1Con.inNode in parent2.nodes && parent1Con.outNode in parent2.nodes) {
      // matching gene
      let childConGene = round(Math.random()) ? parent1Con.copy() : parent2.connections[parent1ConId].copy();
      child.addConnectionGene(childConGene)
      // child.nodeCounter.getInnovation();
    } else {
      // disjoint or exess gene
      let childConGene = parent1Con.copy();
      child.addConnectionGene(childConGene);
      // child.nodeCounter.getInnovation();
    }
  }
  child.nodeCounter.currentInnovation = child.nodes.size
  child.connectionCounter.currentInnovation = child.connections.size
  // console.log(child.nodeCounter.currentInnovation, child.connectionCounter.currentInnovation,
  // parent1.nodeCounter.currentInnovation, parent1.connectionCounter.currentInnovation)
  return child;
}


static compatibilityDistance(genome1, genome2, c1, c2, c3, n_max = Infinity) {
  var excessGenes = 0;
  var disjointGenes = 0;
  var avgWeightDiff = 0;
  var weightDifference = 0;
  var matchingGenes = 0;

  //nodes
  const nodeKeys1 = [...genome1.nodes.keys()].sort();
  const nodeKeys2 = [...genome1.nodes.keys()].sort();

  var highestInnovation1 = nodeKeys1[nodeKeys1.length - 1];
  var highestInnovation2 = nodeKeys2[nodeKeys1.length - 1];
  var indices = Math.max(int(highestInnovation1), int(highestInnovation2));

  for (var i = 0; i <= indices; i++) {
    const node1 = genome1.nodes.get(i);
    const node2 = genome2.nodes.get(i);
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


  const conKeys1 = [...genome1.connections.keys()].sort();
  const conKeys2 = [...genome2.connections.keys()].sort();

  highestInnovation1 = conKeys1[conKeys1.length - 1];
  highestInnovation2 = conKeys2[conKeys2.length - 1];
  indices = Math.max(int(highestInnovation1), int(highestInnovation2));

  for (var i = 0; i <= indices; i++) {
    const connection1 = genome1.connections.get(i);
    const connection2 = genome2.connections.get(i);
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
  var n = max(genome1.nodes.size + genome1.connections.size, genome2.nodes.size + genome2.connections.size);
  if (n < n_max) {
    n = 1;
  }
  return (excessGenes * c1) / n + (disjointGenes * c2) / n + avgWeightDiff * c3;
}


copy() {
  let newGenome = new Genome();
  for (let [NodeId, node] of this.nodes) {
    newGenome.addNodeGene(node.copy());
  }
  for (let [conId, con] of this.connections) {
    newGenome.addConnectionGene(con.copy());
  }
  newGenome.nodeCounter.currentInnovation = this.nodeCounter.currentInnovation
  newGenome.connectionCounter.currentInnovation = this.connectionCounter.currentInnovation
  return newGenome;
}


render() {
  background(170);
  textSize(30)
  for (let [conId, con] of this.connections) {
    if (con.expressed) {
      push()
      strokeWeight(Math.max(abs(con.weight * 4), 0.5));
      if (con.weight < 0) {
        stroke(255, 0, 0)
      } else {
        stroke(0, 255, 0)
      }
      let delta = random(-20, 20)
      try {
        line(this.nodes.get(con.inNode).x, this.nodes.get(con.inNode).y, this.nodes.get(con.outNode).x + this.nodes.get(con.outNode).xDelta, this.nodes.get(con.outNode).y + this.nodes.get(con.outNode).yDelta)
      } catch (e) {
        console.log(e);
        console.log(this.nodes, con)
      }
      strokeWeight(4)
      point(this.nodes.get(con.outNode).x + this.nodes.get(con.outNode).xDelta, this.nodes.get(con.outNode).y + this.nodes.get(con.outNode).yDelta)
      pop()
    }
  }
  for (let [NodeId, node] of this.nodes) {
    push()
    if (node.type == "INPUT") {
      fill(100, 0, 40);
      if (Number.isNaN(node.y)) {
        node.y = height - 50;
      }
      ellipse(node.x, node.y, 50);
      fill(0)
      text(node.id, node.x - 8, node.y + 10);
    } else if (node.type == "OUTPUT") {
      fill(120, 0, 120);
      if (Number.isNaN(node.y)) {
        node.y = 50;
      }
      push()
      node.bias > 0 ? stroke(0, 255, 0) : stroke(255, 0, 0)
      strokeWeight(Math.max(abs(node.bias * 4), 0.5))
      ellipse(node.x, node.y, 50);
      pop()
      fill(0)
      text(node.id, node.x - 8, node.y + 10);
    } else {
      fill(0, 100, 40);
      if (Number.isNaN(node.y)) {
        node.y = random(150, height - 150);
      }
      push()
      node.bias > 0 ? stroke(0, 255, 0) : stroke(255, 0, 0)
      strokeWeight(Math.max(abs(node.bias * 4), 0.5))
      ellipse(node.x, node.y, 50);
      pop()
      fill(0)
      text(node.id, node.x - 8, node.y + 10);
    }
    pop()
  }
}
}
