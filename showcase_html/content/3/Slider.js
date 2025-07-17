// Datei: Slider.js

let Jahre = [1945, 1950, 1955, 1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010];
let sliderWithMultiplicator = 1;

function Slider(_x, _y, _mW, _mH, _vMin, _vMax, _vIn, _myT) {
    this.myX = _x;
    this.myY = _y;

    this.myWidth = _mW;
    this.myHeight = _mH;
    this.myMin = _vMin;
    this.myMax = _vMax;
    this.myInitial = _vIn;
    this.myTitle = _myT;
    this.myTextSize = 16;

    this.numSteps = Jahre.length - 1;
    this.stepWidth = this.myWidth * sliderWithMultiplicator / this.numSteps;

    this.myValue = _vIn;
    this.posButtonX = this.myX + this.myValue * this.stepWidth;
    this.targetPosX = this.posButtonX;

    this.mouseOverMe = false;
    this.draggingMe = false;
    this.whileDraggingMe = false;
    let dif = 0;
    let sliderWidth = this.myWidth * sliderWithMultiplicator;

    this.render = function () {
        this.mouseOverMe = (mouseY > this.myY && mouseY < this.myY + this.myHeight &&
            mouseX > this.posButtonX - this.myHeight / 4 && mouseX < this.posButtonX + this.myHeight / 4);

        this.whileDraggingMe = (mouseX > this.posButtonX - this.myHeight / 4 && mouseX < this.posButtonX + this.myHeight / 4);

        // Animation: posButtonX bewegt sich Richtung targetPosX
        this.posButtonX = lerp(this.posButtonX, this.targetPosX, 0.2);

        fill(124, 139, 171);
        stroke(124, 139, 171);

        line(this.myX - 10, this.myY + 0.5 * this.myHeight, sliderWidth + 90, this.myY + 0.5 * this.myHeight);

        for (let i = 0; i < Jahre.length; i++) {
            strokeWeight(6);
            line(this.myX + i * this.stepWidth, this.myY + 0.5 * this.myHeight, this.myX + i * this.stepWidth, this.myY + 0.75 * this.myHeight);
        }

        noStroke();
        fill(124, 139, 171);
        rect(this.myX, this.myY + this.myHeight / 2.25, sliderWidth, this.myHeight / 6, 5);

        fill(255);
        strokeWeight(this.mouseOverMe ? 3 : 0);
        stroke(255);
        rect(this.posButtonX - this.myHeight / 8, this.myY, this.myHeight / 4, this.myHeight, 5);

        noStroke();
        textSize(this.myTextSize);
        fill(124, 139, 171);
        textAlign(CENTER);
        text(this.myTitle, this.myX + (this.myWidth / 2), this.myY - 10);

        textSize(this.myTextSize);
        textAlign(CENTER);
        for (let j = 0; j < Jahre.length; j++) {
            if (j === this.myValue) {
                fill(255); // Aktuelles Jahr: weiß
            } else {
                fill(124, 139, 171); // Andere Jahre: grau
            }
            text(Jahre[j], this.myX + j * this.stepWidth, this.myY + 40);
        }
    };

    // Tastatursteuerung
    document.addEventListener("keydown", (function (event) {
        if (event.key === "ArrowLeft") {
            if (this.myValue > 0) {
                this.myValue--;
                this.targetPosX = this.myX + this.myValue * this.stepWidth;
            }
        } else if (event.key === "ArrowRight") {
            if (this.myValue < this.numSteps) {
                this.myValue++;
                this.targetPosX = this.myX + this.myValue * this.stepWidth;
            }
        }
    }).bind(this));

    this.mouseClickMe = function () {
        if (this.mouseOverMe) {
            this.draggingMe = true;
            dif = this.posButtonX - mouseX;
        }
    };

    this.mouseDraggingMe = function () {
        if (this.draggingMe) {
            let newX = mouseX + dif;
            newX = constrain(newX, this.myX, this.myX + this.myWidth);
            let stepIndex = Math.round((newX - this.myX) / this.stepWidth);
            this.myValue = stepIndex;
            this.targetPosX = this.myX + stepIndex * this.stepWidth;
        }
    };

    this.mouseReleasedMe = function () {
        var regionByYear = globalReligions.global.find(region => region.year == this.getCurrentYear());
        console.log(regionByYear);

        this.draggingMe = false;
        dif = 0;
    };

    this.getCurrentYear = function () {
        return Jahre[this.myValue];
    };
}