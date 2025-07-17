const Slider = {
  sliderX: 0,
  sliderY: 0,
  sliderWidth: 1370,
  sliderHeight: 3,
  knobX: 0,
  dragging: false,

  setup() {
    this.sliderX = (windowWidth - this.sliderWidth) / 2 + 85;
    this.sliderY = windowHeight - 150;
    this.knobX = this.sliderX;   
  },

  draw() {
    //slider 
    noStroke();
    fill(50);
    rect(
      this.sliderX,
      this.sliderY - this.sliderHeight / 2,
      this.sliderWidth,
      this.sliderHeight,
      this.sliderHeight
    );

    // Slider Bar
    fill(160);
    let progressWidth = this.knobX - this.sliderX;
    rect(
      this.sliderX,
      this.sliderY - this.sliderHeight / 2,
      progressWidth,
      this.sliderHeight,
      this.sliderHeight,
      0,
      0,
      this.sliderHeight
    );

    // Slider
    fill(160); 
    circle(this.knobX, this.sliderY, this.sliderHeight * 2);

    let currentYear = this.getCurrentYear();
    let labelWidth = 60;
    let labelHeight = 30;
    let labelX = this.knobX - labelWidth / 2;
    let labelY = this.sliderY - 50;

    // Jahr Box
    stroke(255); // 白色
    strokeWeight(1);
    noFill();
    rect(labelX, labelY, labelWidth, labelHeight, 3);

    // Jahr
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textFont("Barlow Semi Condensed");
    textSize(16);
    text(currentYear, this.knobX, labelY + labelHeight / 2);

    // jede 10 Jahre
    textAlign(CENTER, TOP);
    textSize(12);
    textFont("Barlow Semi Condensed");

    fill(200);
    for (let year = 1900; year <= 2024; year += 10) {
      let x = map(year, 1900, 2024, this.sliderX, this.sliderX + this.sliderWidth);
      line(x, this.sliderY - 6, x, this.sliderY + 6);
      text(year, x, this.sliderY + 8);
    }
  },

  getCurrentYear() {
    return floor(map(this.knobX, this.sliderX, this.sliderX + this.sliderWidth, 1900, 2024));
  },

  mousePressed() {
    if (dist(mouseX, mouseY, this.knobX, this.sliderY) < this.sliderHeight * 2) {
      this.dragging = true;
    } else if (
      mouseX >= this.sliderX &&
      mouseX <= this.sliderX + this.sliderWidth &&
      abs(mouseY - this.sliderY) < 10
    ) {
      this.knobX = constrain(mouseX, this.sliderX, this.sliderX + this.sliderWidth);
      loop(); 
    }
  },
  

  mouseDragged() {
    if (this.dragging) {
      this.knobX = constrain(mouseX, this.sliderX, this.sliderX + this.sliderWidth);
      console.log("Dragging:", this.knobX);
      loop();
    }
  },

  mouseReleased() {
    this.dragging = false;
  }
};