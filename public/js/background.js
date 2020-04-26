const snows = []; // array to hold snowflake objects

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    fill(240);
    noStroke();
}

function draw() {
    background(169, 184, 197);
    let time = frameCount / 100;

    // create a random number of snow each frame
    for (let i = 0; i < random(0.5); i++) {
        snows.push(new snowflake());
    }

    for (let snow of snows) {
        snow.update(time); // update snow position
        snow.display();
    }
}

class snowflake {
    constructor() {
        this.posX =
        this.posY = random(-10, 0);
        this.initialangle = random(0, width);
        this.size = random(2, 10);

        // width screen
        this.radius = sqrt(random(pow(width / 2, 2)));

        this.update = function (time) {
            let speed = 0.3;
            let angle = speed * time + this.initialangle;
            this.posX = width / 2 + this.radius * sin(angle);

            // different size fall at slightly different y speeds
            this.posY += pow(this.size, 0.3);

            if (this.posY > height) {
                let index = snows.indexOf(this);
                snows.splice(index, 1);
            }
        };

        this.display = function () {
            ellipse(this.posX, this.posY, this.size);
        };
    }
}
