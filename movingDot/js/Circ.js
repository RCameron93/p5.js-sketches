class Circ {
    constructor() {
        // Radius
        this.r = 15;

        // init start position
        this.xpos = random(this.r, width - this.r);
        this.ypos = random(this.r, height - this.r);

        // Speed of the shape
        this.xspeed = 2.8;
        this.yspeed = 2.8;

        this.xdirection = random(-2, 2);    // Left or right
        this.ydirection = random(-1, 1);    // Top or bottom

        this.col = 20;
    }

    xCollide() {
        // Reverse its direction by multiplying by -1
        this.xdirection *= -1;
    }

    yCollide() {
        // Reverse its direction by multiplying by -1
        this.ydirection *= -1;
    }

    edgeDetect() {
        // Test to see if the shape exceeds the boundaries of the screen
        if (this.xpos > width - this.r || this.xpos < this.r) {
            this.xCollide();
        }
        if (this.ypos > height - this.r || this.ypos < this.r) {
            this.yCollide();
        }
    }

    overlap(other, pad = 0) {
        // Does our circle overlap with some other circle
        // Includes an option to "pad" that distance so they never
        // come within some amount of pixels to each other
        let d = dist(this.xpos, this.ypos, other.xpos, other.ypos);
        if (d < (this.r + other.r + pad)) {
            return true;
        }
        else return false;
    }

    collisionDetect(other) {
        if (this.overlap(other)) {
            this.xCollide();
            this.yCollide();
            other.xCollide();
            other.yCollide();
        }
    }

    update() {
        // Update the position of the shape
        this.xpos = this.xpos + this.xspeed * this.xdirection;
        this.ypos = this.ypos + this.yspeed * this.ydirection;

        // Test to see if the shape exceeds the boundaries of the screen
        // If it does, reverse its direction by multiplying by -1
        this.edgeDetect();
    }

    render() {
        fill(this.col);
        noStroke();
        ellipseMode(RADIUS)
        ellipse(this.xpos, this.ypos, this.r, this.r);
    }
}