


class Genome{
  constructor(){
    this.PROBABILITY_PERTURBING = 0.9;

    this.connections = {};
    this.nodes = {};
  }

  addNodeGene(gene){
    this.nodes[gene.id] = gene;
  }

  addConnectionGene(gene){
    this.connections[gene.innovation] = gene;
  }

  mutate(){
    for(let conID in this.connections){
      let con = this.connections[conID];
      if(Math.random() < this.PROBABILITY_PERTURBING){
        con.weight *= Math.random()*2-1; // TODO: adjust those values.
      }else{
        con.weight = Math.random()*4-2;
      }
    }
  }

  addConectionMutation(innovation, maxAttemps=5){
    let tries = 0;
    let success = false;
    while(tries < maxAttemps && success == false){
      tries++;
      let node1 = this.nodes[round(random(0, Object.keys(this.nodes).length-1))];
      let node2 = this.nodes[round(random(0, Object.keys(this.nodes).length-1))];
      let weight = Math.random()*2-1;

      let reversed = false;
      if(node1.type == "HIDDEN" && node2.type == "INPUT"){
        reversed = true;
      }else if(node1.type == "OUTPUT" && node2.type == "HIDDEN"){
        reversed = true;
      }else if(node1.type == "OUTPUT" && node2.type == "INPUT"){
        reversed = true;
      }

      let connectionExists = false;
      for(let con in this.connections){
        if(this.connections[con].inNode == node1.id && this.connections[con].outNode == node2.id){
          connectionExists = true;
          break;
        }else if(this.connections[con].inNode == node2.id && this.connections[con].outNode == node1.id){
          connectionExists = true;
          break;
        }
      }

      let connectionImpossible = false;
      if(node1.type == "INPUT" && node2.type == "INPUT") {
        connectionImpossible = true;
      }else if(node1.type == "OUTPUT" && node2.type == "OUTPUT") {
        connectionImpossible = true;
      }
      if (connectionExists || connectionImpossible) {
        continue;
      }

      let newConnection = new Connection(reversed ? node2.id : node1.id, reversed ? node1.id : node2.id, weight, true, innovation.getInnovation());
      this.connections[newConnection.innovation] = newConnection;
      success = true;
    }
    if (success == false) {
      console.log("Tried, but could not add more connections");
    }
  }

  addNodeMutation(innovation){
    let r =round(random(0, Object.keys(this.connections).length-1))
    let con = this.connections[r];
    let cin = con.inNode;
    let inNode = this.nodes[cin];
    let outNode = this.nodes[con.outNode];

    con.disable();

    let newNode = new Node("HIDDEN", Object.keys(this.nodes).length);
    let inToNew = new Connection(inNode.id, newNode.id, 1, true, innovation.getInnovation());
    let newToOut = new Connection(newNode.id, outNode.id, con.weight, true, innovation.getInnovation());
    this.nodes[newNode.id] = newNode;
    this.connections[inToNew.innovation] = inToNew;
    this.connections[newToOut.innovation] = newToOut;
  }


  /**
  * @param parent1  More fit parent
  * @param parent2  Less fit parent
  */
  static crossover(parent1, parent2){
    let child = new Genome();

    for(let parent1NodeId in parent1.nodes){
      child.addNodeGene(parent1.nodes[parent1NodeId].copy());
    }

    for(let parent1NodeId in parent1.connections){
      if(parent1.connections[parent1NodeId].innovation in parent2.connections){
        // matching gene
        let childConGene = round(Math.random()) ? parent1.connections[parent1NodeId].copy() : parent2.connections[parent1.connections[parent1NodeId].innovation].copy();
        child.addConnectionGene(childConGene)
      }else{
        // disjoint or exess gene
        let childConGene = parent1.connections[parent1NodeId].copy();
        child.addConnectionGene(childConGene);
      }
    }
    return child;
  }

  copy(){
    let newGenome = new Genome();
    for(let NodeId in this.nodes){
      newGenome.addNodeGene(this.nodes[NodeId].copy());
    }
    for(let NodeId in this.connections){
      newGenome.addConnectionGene(this.connections[NodeId].copy());
    }
    return newGenome;
  }


  render(){
    background(170);
    for(let NodeId in this.nodes){
      let node = this.nodes[NodeId];
      if(node.type == "INPUT"){
        fill(100, 0, 40);
        if(Number.isNaN(node.y)){
          node.y = height-50;
        }
        ellipse(node.x, node.y, 30);
      }else if(node.type == "OUTPUT"){
        fill(120, 0, 120);
        if(Number.isNaN(node.y)){
          node.y = 50;
        }
        ellipse(node.x, node.y, 30);
      }else{
        fill(0, 100, 40);
        if(Number.isNaN(node.y)){
          node.y = random(150, height-150);
        }
        ellipse(node.x, node.y, 30);
      }
    }
    for(let NodeId in this.connections){
      let con = this.connections[NodeId];
      if(con.expressed){
        push()
        strokeWeight(con.weight*4);
        if(con.weight<0){
          stroke(255, 0, 0)
        }else{
          stroke(0, 255, 0)
        }
        let delta = random(-20, 20)
        line(this.nodes[con.inNode].x, this.nodes[con.inNode].y, this.nodes[con.outNode].x+this.nodes[con.outNode].xDelta, this.nodes[con.outNode].y+this.nodes[con.outNode].yDelta)
        strokeWeight(4)
        point(this.nodes[con.outNode].x+this.nodes[con.outNode].xDelta, this.nodes[con.outNode].y+this.nodes[con.outNode].yDelta)
        pop()
      }
    }

  }
}
