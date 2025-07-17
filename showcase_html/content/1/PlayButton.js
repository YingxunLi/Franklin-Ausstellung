const PlayButton = {
    isPlaying: false, 
    interval: null,
  
    setup() {
      this.x = 120;
      this.y = windowHeight - 160;
      this.width = 80;
      this.height = 30;
    },
  
    draw() {
    stroke(255);
    strokeWeight(1);
      fill(this.isPlaying ? 'black' : 'white');
      rect(this.x, this.y, this.width, this.height, 3);
  
      fill(this.isPlaying ? 'white' : 'black');
      textAlign(CENTER, CENTER);
      textSize(16);
      textFont("Barlow Semi Condensed");

      text(this.isPlaying ? 'Pause' : 'Play', this.x + this.width / 2, this.y + this.height / 2);
    },
  
    toggle() {
      this.isPlaying = !this.isPlaying;
  
      if (this.isPlaying) {
        this.start();
      } else {
        this.stop();
      }
      loop(); 
    },
  
    start() {
      this.interval = setInterval(() => {
        Slider.knobX += 2; 
        if (Slider.knobX >= Slider.sliderX + Slider.sliderWidth) {
          Slider.knobX = Slider.sliderX + Slider.sliderWidth; 
          this.stop();
        }
        loop();
      }, 30);
    },
  
    stop() {
      clearInterval(this.interval);
      this.interval = null;
      noLoop(); 
    },
  
    isMouseOver() {
      return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
    }
  };