// Noise Sifter
// Ross Cameron 2020/07/01

// Sketch that loads an image into memory, then generates a canvas of noise of the same dimensions
// For each pixel of noise, if it comes within a threshold of similarity to the corrseponding pixel of the image file, it is "locked in" and will no longer change
// Eventually, the original image should emerge from the noise
// How noisy the final image is will depend on the threshold
// A smaller threshold will produce a more accurate image but will take much longer to do so

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
    // takes ~0.0015ms
    // let d = dist(this.pixel[0], this.pixel[1], this.pixel[2],
    //   other[0], other[1], other[2]);

    // Rough comparison 
    // d^2 = (r2-r1)^2 + (g2-g1)^2 + (b2-b1)^2
    delta *= delta;
    let d = (
      (this.pixel[0] - other[0]) * (this.pixel[0] - other[0]) +
      (this.pixel[1] - other[1]) * (this.pixel[1] - other[1]) +
      (this.pixel[2] - other[2]) * (this.pixel[2] - other[2])
    );

    return (d < delta);
  }

  update(other) {
    // Generate a new random value for this pixel
    this.newCol();

    // Compare the new value to our reference
    let matches = this.compareDist(other);

    if (matches) {
      // This pixel matches, stop generating new values
      this.locked = true;
      lockedPixels++;
    }
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

  // Total amount of pixels in the image
  pixelArrayLength = width * height;

  // Create an array of noisePixels
  for (let i = 0; i < pixelArrayLength; i++) {
    let noisePixel = new NoisePixel();
    noiseGen.push(noisePixel);
  }

  img.loadPixels();
}

function generateNoise() {
  // Scan through canvas, row by column
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Assumes pixel density of 1
      let index = (x + y * width);

      let noisePixel = noiseGen[index];

      if (!noisePixel.locked) {
        // Get the colour values of our corresponding image pixel
        let off = index * 4;
        let referencePixel = [
          img.pixels[off],
          img.pixels[off + 1],
          img.pixels[off + 2],
          // img.pixels[off + 3]
          // Assume all pixels have full alpha for now
          255
        ]

        // Generate a new noisy pixel and compare it to the image
        noisePixel.update(referencePixel);

        // Display the noisy pixel
        set(x, y, noisePixel.pixel)
      }
    }
  }
}

function draw() {
  generateNoise();

  // Check if all pixels are locked
  if ((lockedPixels) == pixelArrayLength) {
    noLoop();
  }

  updatePixels();
}