class Cactus{
    constructor(){
        this.xPos = width + 20;
        this.yPos = height - 30;
    }
    move(){
        if (this.xPos > -10){
            this.xPos = this.xPos - 10;
        }
        else{
            this.xPos = width + 20;
        }
    }
    render(){
        fill(255, 0, 0);
        rect(this.xPos, this.yPos, 20, 80));
    }
}