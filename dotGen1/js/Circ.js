class Circ {
    constructor(_c) {
        this.size = random(20, 100);
        // Radius
        this.r = this.size / 2;
        // X and Y starting pos are always within the canvas
        this.x = random(this.r, width - this.r);
        this.y = random(this.r, height - this.r);
        // Colour is the only parameter that is actually passed to the constructor
        this.c = _c
    }

    render() {
        colorMode(HSB, 255);
        fill(this.c);
        noStroke();
        circle(this.x, this.y, this.size);
    }
}