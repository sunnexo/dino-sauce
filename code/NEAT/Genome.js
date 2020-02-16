class Genome {
  constructor() {
    this.connections = new Map();
    this.nodes = new Map();
    this.nodeCounter = new Counter();
    this.connectionCounter = new Counter();
    this.feedCounter = 0;
    this.looped = false;
    this.PROBABILITY_PERTURBING = 0.995;
    this.fitness = 0;
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
    // for (let [inID, inNode] of this.nodes) {
    //   if (inNode.type == "INPUT") {
    //     for (let [outID, outNode] of this.nodes) {
    //       if (outNode.type == "OUTPUT") {
    //         this.addConnectionGene(new Connection(int(inID), int(outID), Math.random() * 4 - 2, true, this.connectionCounter.getInnovation()))
    //       }
    //     }
    //   }
    // }
    this.addConectionMutation();
    return this;
  }

  addNodeGene(gene) {
    this.nodes.set(gene.id, gene);
  }

  addConnectionGene(gene) {
    this.connections.set(gene.innovation, gene);
  }

  feed(inputs) {
    var outputs = [];
    for (let [inID, inNode] of this.nodes) {
      if (inNode.type == "INPUT") {
        inNode.setVal(inputs[int(inID)]);
        inNode.gotOutput = true;
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
    if (node.gotOutput) {
      // console.log(node.copy())
      return node.getOutput();
    }
    var val = 0;
    for (let [con_id, con] of this.connections) {
      if (con.outNode == node_id && con.expressed) {
        this.feedCounter++;
        if (this.feedCounter > 10000) {
          console.log(this.connections, this.checkIfNoLoop(), [...this.nodes]);
          throw new Error("caldslfkj");
          return 0;
        }
        node.feed(con.feed(this.feedNode(con.inNode)));
      }
    }
    return node.getOutput();
  }

  mutate(prob = 0.042) {
    for (let [conID, conVal] of this.connections) {
      let con = conVal;
      if (Math.random() < this.PROBABILITY_PERTURBING) {
        con.weight += randomGaussian(0, prob);
        // con.weight += Math.random() - 0.5; // TODO: adjust those values.
      } else {
        con.weight = Math.random() * 4 - 2;
      }
    }
    for (let [nodeID, node] of this.nodes) {
      if (Math.random() < this.PROBABILITY_PERTURBING) {
        node.bias += randomGaussian(0, prob);

        // node.bias *= Math.random() * 4 - 2; // TODO: adjust those values.
        // node.bias += Math.random() - 0.5; // TODO: adjust those values.
      } else {
        node.bias = Math.random() * 4 - 2;
      }
    }
  }

  disableConectionMutation() {
    this.connections.get(floor(random(0, this.connections.size))).disable();
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
      let exitsCon = null;
      for (let [con_id, con] of this.connections) {
        if (con.inNode === node1.id && con.outNode === node2.id) {
          connectionExists = true;
          if (!con.expressed) {
            exitsCon = con;
          }
          break;
        } else if (con.inNode === node2.id && con.outNode === node1.id) {
          connectionExists = true;
          if (!con.expressed) {
            exitsCon = con;
          }
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

      if (connectionImpossible || (connectionExists && exitsCon === null)) {
        continue;
      }
      let newConnection;
      if (exitsCon != null) {
        exitsCon.expressed = true;
        newConnection = exitsCon;
      } else {
        newConnection = new Connection(
          reversed ? node2.id : node1.id,
          reversed ? node1.id : node2.id,
          weight,
          true,
          this.connectionCounter.getInnovation()
        );
      }
      this.connections.set(newConnection.innovation, newConnection);
      if (this.checkIfNoLoop() && !isOkay) {
        this.connections.delete(this.connectionCounter.dec());
        continue;
      }
      success = true;
    }
  }

  checkIfNoLoopFF(node_id, sended_ids = []) {
    // console.log(sended_ids)
    let sd = [...sended_ids];
    if (node_id == NaN) {
      return NaN;
    }
    let node = this.nodes.get(node_id);
    if (sd.includes(node_id) || this.looped) {
      // console.log(sd, node_id)
      this.looped = true;
      return NaN;
    }
    sd.push(node_id);
    // console.log(sd,sended_ids)
    if (node.gotOutput) {
      return node.getOutput();
    }
    var val = 0;
    for (let [con_id, con] of this.connections) {
      if (con.outNode == node_id) {
        node.feed(con.feed(this.checkIfNoLoopFF(con.inNode, sd)));
      }
    }
    return node.getOutput();
  }

  checkIfNoLoop() {
    this.looped = false;
    for (let [inID, inNode] of this.nodes) {
      if (inNode.type == "INPUT") {
        inNode.setVal(0);
        inNode.gotOutput = true;
      }
    }
    for (let [outID, outNode] of this.nodes) {
      if (outNode.type == "OUTPUT") {
        this.feedCounter = 0;
        this.checkIfNoLoopFF(outID);
      }
    }
    for (let [node_id, node] of this.nodes) {
      node.reset();
    }
    return this.looped;
  }

  addNodeMutation() {
    if (this.connections.size === 0) {
      return;
    }
    const r = floor(random(0, this.connections.size));
    const con = this.connections.get(r);
    const inNode = this.nodes.get(con.inNode);
    const outNode = this.nodes.get(con.outNode);

    con.disable();

    const newNode = new Node("HIDDEN", this.nodeCounter.getInnovation());
    const inToNew = new Connection(
      inNode.id,
      newNode.id,
      1,
      true,
      this.connectionCounter.getInnovation()
    );
    const newToOut = new Connection(
      newNode.id,
      outNode.id,
      con.weight,
      true,
      this.connectionCounter.getInnovation()
    );
    this.nodes.set(newNode.id, newNode);
    this.connections.set(inToNew.innovation, inToNew);
    this.connections.set(newToOut.innovation, newToOut);
  }

  /**
   * @param parent1  More fit parent
   * @param parent2  Less fit parent
   */
  static crossover(parent1, parent2, trys = 5) {
    let counter = 0;
    while (counter < trys) {
      counter++;
      let child = new Genome();
      for (let [parent1NodeId, parent1Node] of parent1.nodes) {
        child.addNodeGene(parent1Node.copy());
      }

      for (let [parent1ConId, parent1Con] of parent1.connections) {
        if (
          parent1Con.innovation in parent2.connections &&
          parent1Con.inNode in parent2.nodes &&
          parent1Con.outNode in parent2.nodes
        ) {
          // matching gene
          let childConGene = round(Math.random())
            ? parent1Con.copy()
            : parent2.connections[parent1ConId].copy();
          child.addConnectionGene(childConGene);
        } else {
          // disjoint or exess gene
          let childConGene = parent1Con.copy();
          child.addConnectionGene(childConGene);
        }
      }
      child.nodeCounter.currentInnovation = child.nodes.size;
      child.connectionCounter.currentInnovation = child.connections.size;

      if (child.checkIfNoLoop() == false) {
        // console.log(parent1, parent2, child)
        return child;
      }
    }
    return parent1.copy();
  }

  static compatibilityDistance(genome1, genome2, c1, c2, c3, n_max = 20) {
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

    if (genome1.connections.size >= 2 || genome2.connections.size >= 2) {
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
    } else {
      return 0;
    }

    avgWeightDiff = weightDifference / matchingGenes;
    var n = max(
      genome1.nodes.size + genome1.connections.size,
      genome2.nodes.size + genome2.connections.size
    );
    if (n < n_max) {
      n = 1;
    }
    return (
      (excessGenes * c1) / n + (disjointGenes * c2) / n + avgWeightDiff * c3
    );
  }

  copy() {
    let newGenome = new Genome();
    for (let [NodeId, node] of this.nodes) {
      newGenome.addNodeGene(node.copy());
    }
    for (let [conId, con] of this.connections) {
      newGenome.addConnectionGene(con.copy());
    }
    newGenome.nodeCounter.currentInnovation = this.nodeCounter.currentInnovation;
    newGenome.connectionCounter.currentInnovation = this.connectionCounter.currentInnovation;
    return newGenome;
  }

  render() {
    // background(170);
    textSize(30);
    for (let [NodeId, node] of this.nodes) {
      push();
      if (node.type == "INPUT") {
        fill(100, 0, 40);
        if (Number.isNaN(node.y)) {
          node.y = 400;
        }
        ellipse(node.x, node.y, 50);
        fill(0);
        text(node.id, node.x - 8, node.y + 10);
      } else if (node.type == "OUTPUT") {
        fill(120, 0, 120);
        if (Number.isNaN(node.y)) {
          node.y = 50;
        }
        push();
        node.bias > 0 ? stroke(0, 255, 0) : stroke(255, 0, 0);
        strokeWeight(Math.max(abs(node.bias * 4), 0.5));
        ellipse(node.x, node.y, 50);
        pop();
        fill(0);
        text(node.id, node.x - 8, node.y + 10);
      } else {
        fill(0, 100, 40);
        if (Number.isNaN(node.y)) {
          node.y = random(80, 260);
        }
        push();
        node.bias > 0 ? stroke(0, 255, 0) : stroke(255, 0, 0);
        strokeWeight(Math.max(abs(node.bias * 4), 0.5));
        ellipse(node.x, node.y, 50);
        pop();
        fill(0);
        text(node.id, node.x - 8, node.y + 10);
      }
      pop();
    }
    for (let [conId, con] of this.connections) {
      if (con.expressed) {
        push();
        strokeWeight(Math.max(abs(con.weight * 4), 1));
        if (con.weight < 0) {
          if (con.inNode.y < con.outNode.y) {
            stroke(255, 0, 255);
          } else {
            stroke(255, 0, 0);
          }
        } else {
          if (con.inNode.y < con.outNode.y) {
            stroke(0, 255, 255);
          } else {
            stroke(0, 255, 0);
          }
        }
        let delta = random(-20, 20);
        line(
          this.nodes.get(con.inNode).x,
          this.nodes.get(con.inNode).y,
          this.nodes.get(con.outNode).x + this.nodes.get(con.outNode).xDelta,
          this.nodes.get(con.outNode).y + this.nodes.get(con.outNode).yDelta
        );
        strokeWeight(4);
        point(
          this.nodes.get(con.outNode).x + this.nodes.get(con.outNode).xDelta,
          this.nodes.get(con.outNode).y + this.nodes.get(con.outNode).yDelta
        );
        pop();
      }
    }
  }
}
