let circles = [];
let nCircles = 8
function setup() {
  createCanvas(windowWidth, 400);
  frameRate(30);
  for (let i = 0; i < nCircles; i++) {
    let newCircle = new Circ();
    let overlap = false;

    // Since this method discards a circle if an overlap is detected
    // there's significant a chance it will produce less than nCircles
    for (let otherCircle of circles) {
      if (newCircle.overlap(otherCircle, 4)) {
        overlap = true;
        break;
      }
    }

    if (!overlap) {
      circles.push(newCircle);
    }
  }
}

function draw() {
  background(240, 240, 100);

  for (let i = 0; i < circles.length; i++) {
    let thisCircle = circles[i];

    thisCircle.update();
    for (let j = i; j < circles.length; j++) {
      let otherCircle = circles[j];
      thisCircle.collisionDetect(otherCircle);
    }
    thisCircle.render();
  }
}
