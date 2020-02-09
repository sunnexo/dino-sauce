


class Genome{
  constructor(){
    this.connections = {};
    this.nodes = {};
  }

  addNodeGene(gene){
    this.nodes[id] = gene;
  }

  addConnectionGene(gene){
    this.connections[gene.innovation] = gene;
  }

  addConectionMutation(innovation){
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

    let connectionExist = false;
    for(let con in this.connections){
      if(this.connections[con].inNode == node1.id && this.connections[con].outNode == node2.id){
        connectionExist = true;
        break;
      }else if(this.connections[con].inNode == node2.id && this.connections[con].outNode == node1.id){
        connectionExist = true;
        break;
      }
    }
    if(connectionExist){
      return;
    }
    let newConnection = new Connection(reversed ? node2.id : node1.id, reversed ? node1.id : node2.id, weight, true, innovation.getInnovation());
    this.connections[newConnection.id] = newConnection;
  }

  addNodeMutation(innovation){
    let con = this.connections[round(random(0, Object.keys(this.connections).length-1))];
    let inNode = this.nodes[con.inNode];
    let outNode = this.nodes[con.outNode];

    con.disable();

    let newNode = new Node("HIDDEN", this.nodes.length());
    let inToNew = new Connection(inNode.id, newNode.id, 1, true, innovation.getInnovation());
    let newToOut = new Connection(newNode.id, outNode.id, con.weight, true, innovation.getInnovation());

    this.nodes[newNode.id] = newNode;
    this.connections[inToNew.innovation] = inToNew;
    this.connections[newToIn.innovation] = newToIn;
  }


  /**
  * @param parent1  More fit parent
  * @param parent2  Less fit parent
  */
  crossover(parent1, parent2){

  }




}
