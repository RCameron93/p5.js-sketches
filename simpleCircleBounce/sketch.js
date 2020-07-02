class Ball {
  constructor(_x, _y, _d, _vx = 0, _vy = 0) {
    this.x = _x;
    this.y = _y;
    this.vx = _vx;
    this.vy = _vy;
    this.diameter = _d;
    this.r = this.diameter / 2;
    this.c = random(256);
    // this.id = _id;
    // this.other = _o;
  }

  collide(other) {
    let dx = other.x - this.x;
    let dy = other.y - this.y;
    let distance = sqrt(dx * dx + dy * dy);
    let minDist = this.r + other.r + 3;

    if (distance <= minDist) {
      let angle = atan2(dy, dx);
      let targetX = this.x + cos(angle) * minDist;
      let targetY = this.y + sin(angle) * minDist;

      let ax = (targetX - other.x) * 0.05;
      let ay = (targetY - other.y) * 0.05;
      this.vx -= ax;
      this.vy -= ay;
      other.vx += ax;
      other.vy += ay;

      // let ax = Math.sign(targetX - other.x);
      // let ay = Math.sign(targetY - other.y);
      // if (ax === 0) {
      //   ax = 1;
      // }
      // if (ay === 0) {
      //   ay = 1;
      // }
      // this.vx *= ax;
      // this.vy *= ay;
      // other.vx *= ax;
      // other.vy *= ay;


      // this.x -= 1;
      // this.y -= 1;
      // other.x += 1;
      // other.y += 1;



      // let report = { dx, dy, distance, minDist, angle, targetX, targetY, ax, ay };
      // console.log(report);
      // noLoop();
    }
  }

  boundaryDetect() {
    if (this.x + this.r > width || this.x - this.r < 0) {
      this.vx *= -1;
    }
    if (this.y + this.r > height || this.y - this.r < 0) {
      this.vy *= -1;
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.boundaryDetect();
  }

  render() {
    fill(this.c);
    circle(this.x, this.y, this.diameter);
  }
}

let numBalls = 10
let balls = []


function setup() {
  createCanvas(720, 400);

  // manual for now
  // balls.push(new Ball(300, 10, 10, 1, 1));
  // balls.push(new Ball(420, 10, 10, -1, 1));

  for (let i = 0; i < numBalls; i++) {
    let x = random(15, width - 15);
    let y = random(15, height - 15);
    let d = 30;
    let dx = random(-2, 2);
    let dy = random(-2, 2);
    let newBall = new Ball(x, y, d, dx, dy);
    balls.push(newBall);
  }

  noStroke();
  fill(255);
}

function draw() {
  background(100);

  noStroke();
  fill(255);
  for (let i = 0; i < numBalls; i++) {
    balls[i].update();
    for (let j = 0; j < numBalls; j++) {
      if (i != j) {
        balls[i].collide(balls[j]);
      }
    }
    balls[i].render();
  }

  // stroke(255);
  // // direct chord
  // line(balls[0].x, balls[0].y, balls[1].x, balls[1].y);

  // //dx
  // stroke('red');
  // line(balls[1].x, balls[0].y, balls[0].x, balls[0].y);
  // let dx = 'dx: ' + (balls[1].x - balls[0].x)
  // fill('red')
  // noStroke();
  // text(dx, 10, 10);
  // //dy
  // stroke('blue');
  // line(balls[1].x, balls[0].y, balls[1].x, balls[1].y);
  // let dy = 'dy: ' + (balls[1].y - balls[0].y)
  // fill('blue')
  // noStroke();
  // text(dy, 10, 30);



}

