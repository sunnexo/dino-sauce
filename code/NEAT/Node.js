


class Node{

  constructor(type, id){
    this.type = type;
    this.id = id;
  }

  copy(){
    return new Node(this.type, this.id);
  }
}
