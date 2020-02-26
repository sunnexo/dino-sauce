class Dino {
  constructor(isBot = false) {
    this.run = true;
    this.isJumping = 0;
    this.score = 0;
    this.dy = height * -0.18
    this.dx = -this.dy * 0.875
    this.x = 120;
    this.y = Game.ground();
    this.yVell = 0;
    this.grav = -1.9;
    this.isBot = isBot;
    this.leftSpeed = 12
    this.rightSpeed = 10;
    this.currentSpriteIndex = 0;
    this.currentSprite = iPlayerRun[this.currentSpriteIndex];
  }

  update() {
    if (!this.isBot) {
      this.move();
      if (frameCount % 20 === 0) {
        this.currentSpriteIndex++
        this.currentSprite = iPlayerRun[this.currentSpriteIndex];
        if (this.currentSpriteIndex >= 2) {
          this.currentSpriteIndex = 0;
        }
      }
    }
    if (this.jump > 0) {
      this.dx = -this.dy * 0.8
    } else {
      this.dx = -this.dy * 0.875
    }

    if (this.y > Game.ground()) {
      if (!this.isBot) {
        if (sound) {
          sLand.play()
        }
      }
    }
    if (this.y > Game.ground()) {
      this.isJumping = 0;
    }
    if (this.y >= Game.ground()) {
      this.y = Game.ground();
    }
    if (this.yVell >= 0 && this.y >= Game.ground()) {
      this.yVell = 0;
    } else {
      this.yVell = this.yVell - this.grav;
    }
    this.y += this.yVell;
  }

  render() {
    fill(200, 100, 0);
    if (this.isBot) {
      if (this.isJumping == 0) {
        image(iPlayerStand, this.x, this.y, this.dx, this.dy)
      } else {
        image(iPlayerJump, this.x, this.y, this.dx, this.dy)
      }
    } else {
      if (this.isJumping == 0) {
        image(this.currentSprite, this.x, this.y, this.dx, this.dy)
      } else {
        image(iPlayerJump, this.x, this.y, this.dx, this.dy)
      }
    }

    // push()
    // noFill()
    // strokeWeight(4);
    // stroke(255, 204, 100);
    // rect(this.x, this.y, this.dx, this.dy)
    // pop()
  }

  jump() {
    if (this.isBot) {
      if (this.y >= Game.ground()) {
        this.isJumping = 0;
      }
      if (this.isJumping < 2) {
        this.isJumping++;
        this.yVell = -35;
        if (!this.isBot) {
          if (sound) {
            sJump.play();
          }
        }
      }
    } else {
      if (this.y >= Game.ground() || this.isJumping < 2) {
        this.isJumping++;
        this.yVell = -35;
        if (!this.isBot) {
          if (sound) {
            sJump.play();
          }
        }
      }
    }

  }

  move(left = NaN, right = NaN) {
    if (this.isBot) {
      if (left && this.x >= 0) {
        this.x -= this.leftSpeed;
      }
      if (right && this.x + this.dx <= width) {
        this.x += this.rightSpeed;
      }
    } else {
      if ((keyIsDown(97) || keyIsDown(65)) && this.x + this.dx >= 0) {
        // this.x -= 7;
        this.x -= this.leftSpeed;
      } else if ((keyIsDown(100) || keyIsDown(68)) && this.x + this.dx <= width) {
        // this.x += 5;
        this.x += this.rightSpeed;
      }
    }
  }
}
