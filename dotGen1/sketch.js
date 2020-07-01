let circles = [];

function generateCircles(col) {
  // https://editor.p5js.org/slow_izzm/sketches/HyqLs-7AX

  // More tries will generally result in a denser field of circles
  let tries = 0, maxTries = 10000;
  // This max may not be reached after the max amount of tries
  // Depends on the size of the window
  let maxCircles = 200

  while (circles.length < 200) {
    // js/circ.js
    let newCircle = new Circ(col);
    let overlap = false;

    for (oldCircle of circles) {
      // The distance between the centre of our new circle and any old circles
      let d = dist(newCircle.x, newCircle.y, oldCircle.x, oldCircle.y);
      // The edge of the new circle can't be within 10px of the old one
      if (d < (10 + newCircle.r + oldCircle.r)) {
        overlap = true;
        break;
      }
    }

    // If there's no overlap then we can add it to the array of circles to be rendered
    if (!overlap) {
      circles.push(newCircle);
    }

    // Control
    // Since we may never find enough circles that fufill our parameters, we give up eventually
    tries++;
    if (tries > maxTries) {
      break;
    }
  }
}

function setup() {

  let myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent('p5container');

  colorMode(HSB, 255);

  // Generate Colours
  const h1 = random(256);
  const h2 = (3 * h1 + 60) % 360;
  const c1 = color(h1, 126, 255);
  const c2 = color(h2, 120, 255);
  // const c1 = color(0, 0, 255);
  // const c2 = color(0, 0, 0);

  let hw = select('#hw');
  hw.style("color", c2);

  let wholePage = select("#page");
  wholePage.style("background-color", c1);



  background(c1);
  generateCircles(c2);

  console.log(circles.length);
}

function draw() {
  for (let circ of circles) {
    circ.render();
  }
}