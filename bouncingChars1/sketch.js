// Ross Cameron 2020/07/01
// Simple sketch to turn text into moving objects
// Collision detection based on individual bounding boxes (hitboxes)
// Collision resolution is very simple direction reversal
// Final result is still a text object

let txtStr = 'hello';
let myFont;
let txtArray = [];

class movableChar {
  constructor(_c, _x, _y) {
    // Initial values
    this.char = _c;
    this.x = _x;
    this.y = _y;

    this.bounds = {};

    this.xspeed = 1;
    this.yspeed = 1;


    this.xdirection = random(-2, 2); // Left or right
    this.ydirection = random(-1, 1); // Top or bottom
  }

  getBounds() {
    this.bounds = myFont.textBounds(this.char, this.x, this.y);
  }

  xCollide() {
    // Reverse its direction by multiplying by -1
    this.xdirection *= -1;
  }

  yCollide() {
    // Reverse its direction by multiplying by -1
    this.ydirection *= -1;
  }

  boundaryDetect() {
    // check for collides with the edge of the canvas
    if (this.bounds.x < (0) || this.bounds.x > (width - this.bounds.w)) {
      this.xCollide();
    }
    if (this.bounds.y < (0) || this.bounds.y > (height - this.bounds.h)) {
      this.yCollide();
    }
  }

  collisionDetect(other) {
    let axL = this.bounds.x < other.bounds.x + other.bounds.w;
    let axR = this.bounds.x + this.bounds.w > other.bounds.x;
    let ayT = this.bounds.y < other.bounds.y + other.bounds.h;
    let ayB = this.bounds.y + this.bounds.h > other.bounds.y;

    if (axL && axR && ayT && ayB) {
      this.xCollide();
      this.yCollide();
      other.xCollide();
      other.yCollide();
    }
  }

  update() {
    // char movement
    this.x = this.x + this.xspeed * this.xdirection;
    this.y = this.y + this.yspeed * this.ydirection;

    // hitbox movement
    this.bounds.x = this.bounds.x + this.xspeed * this.xdirection;
    this.bounds.y = this.bounds.y + this.yspeed * this.ydirection;

    this.boundaryDetect();
  }

  renderBounds() {
    fill(255);
    noStroke();
    rect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
  }


  render() {
    fill(0);
    noStroke();
    text(this.char, this.x, this.y);
  }
}


function preload() {
  myFont = loadFont('assets/DMMono-Regular.ttf');
}

function setup() {
  createCanvas(400, 400);

  // Format font
  textAlign(LEFT, TOP);
  textSize(100);
  textFont(myFont);

  // Fill array with movable characters
  for (let i = 0; i < txtStr.length; i++) {
    // For this monospace font, each char is 60px apart
    let newChar = new movableChar(txtStr[i], 60 * i, 0);
    newChar.getBounds();
    txtArray.push(newChar);
  }
}

function draw() {
  background(220);

  // Render text
  for (let i = 0; i < txtArray.length; i++) {
    let char = txtArray[i];
    char.update();
    for (let j = i; j < txtArray.length; j++) {
      let otherChar = txtArray[j];
      char.collisionDetect(otherChar);
    }
    // char.renderBounds();
    char.render();
  }


  // for (let char of txtArray) {
  //   char.update();
  //   // char.renderBounds();
  //   char.render();
  // }

}