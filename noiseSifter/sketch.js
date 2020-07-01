p5.disableFriendlyError = true;

class Profiler {
  constructor() {
    this.report = {}
  }

  startTimer(processId) {
    let time = performance.now();

    if (processId in this.report) {
      this.report[processId].t0 = time;
    }
    else {
      this.report[processId] = {
        totalTime: 0,
        meanTime: 0,
        count: 1,
        t0: time,
      };
    }
  }

  stopTimer(processId) {
    let t1 = performance.now()
    let delta = t1 - this.report[processId].t0;

    this.report[processId].count++;
    this.report[processId].totalTime += delta;
    this.report[processId].meanTime = this.report[processId].totalTime / this.report[processId].count;
  }

  printReport() {
    console.log(this.report);
  }
}

let profiling = new Profiler;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let img;
let noiseGen = [];
let pixelArrayLength = 0;
let lockedPixels = 0;

class NoisePixel {
  constructor() {
    this.pixel = [0, 0, 0, 255];
    this.locked = false;
  }

  newCol() {
    this.pixel = [getRandomInt(256), getRandomInt(256), getRandomInt(256), 255];
  }

  compareDist(other, delta = 10) {
    // Proper Euclidean distance
    // 0.001437ms
    // let d = dist(
    //   this.pixel[0],
    //   this.pixel[1],
    //   this.pixel[2],
    //   other[0],
    //   other[1],
    //   other[2]
    // );

    // Rough comparison
    let d = (
      (this.pixel[0] - other[0]) * (this.pixel[0] - other[0]) +
      (this.pixel[1] - other[1]) * (this.pixel[1] - other[1]) +
      (this.pixel[2] - other[2]) * (this.pixel[2] - other[2])
    );
    delta *= delta;

    return (d < delta);
  }

  update(other) {
    profiling.startTimer("pixUpdate");

    // Generate a new random value for this pixel
    profiling.startTimer("newCol");
    this.newCol();
    profiling.stopTimer("newCol");

    // Compare the new value to our reference
    profiling.startTimer("compare");
    let matches = this.compareDist(other);
    profiling.stopTimer("compare");

    if (matches) {
      // This pixel matches, stop generating new
      // values for it
      this.locked = true;
      lockedPixels++;
    }

    profiling.stopTimer("pixUpdate");
  }

  render() {
    return this.pixel;
  }
}

function preload() {
  img = loadImage('assets/fullcol100.bmp');
  image(img, 0, 0);
}

function setup() {
  createCanvas(img.width, img.height);
  pixelDensity(1);

  pixelArrayLength = width * height;

  // Create an array of noisePixels
  for (let i = 0; i < pixelArrayLength; i++) {
    let noisePixel = new NoisePixel();
    noiseGen.push(noisePixel);
  }

  img.loadPixels();
}

function generateNoise() {
  for (let y = 0; y < height; y++) {
    profiling.startTimer("oneRow");
    for (let x = 0; x < width; x++) {
      profiling.startTimer("onePixel");

      let index = (x + y * width);

      profiling.startTimer("assignPix");
      let noisePixel = noiseGen[index];
      profiling.stopTimer("assignPix");

      if (!noisePixel.locked) {
        profiling.startTimer("getRef");
        let off = index * 4;
        let referencePixel = [
          img.pixels[off],
          img.pixels[off + 1],
          img.pixels[off + 2],
          img.pixels[off + 3]
        ]
        profiling.stopTimer("getRef");

        noisePixel.update(referencePixel);

        profiling.startTimer('setPix');
        set(x, y, noisePixel.pixel)
        profiling.stopTimer('setPix');
      }

      profiling.stopTimer("onePixel");
    }
    profiling.stopTimer("oneRow");
  }
}

function draw() {
  profiling.startTimer('draw')
  // Update our noise pixels
  // for (let y = 0; y < height; y++) {
  //   for (let x = 0; x < width; x++) {
  //     let index = (x + y * width);
  //     // Get the pixel value from the image
  //     let referencePixel = img.get(x, y);
  //     let noisePixel = noiseGen[index];
  //     noisePixel.update(referencePixel);
  //     set(x, y, noisePixel.pixel)
  //   }
  // }
  profiling.startTimer('noiseGenAllPix');
  generateNoise();
  profiling.stopTimer('noiseGenAllPix');

  // Check if all pixels are locked
  if ((lockedPixels) == pixelArrayLength) {
    noLoop();
  }

  updatePixels();
  // noLoop();
  profiling.stopTimer("draw");
}