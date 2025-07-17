class Button {
  constructor(_x, _y, _sZ, _tl) {
    this.myX = _x;
    this.myY = _y;
    this.mySize = _sZ;
    this.myTitle = _tl;
    this.myColor = color(155, 40, 155);
    this.myOverMeColor = color(40, 58, 98);
    this.myStrokeColor = color(255, 40, 155);
    this.mouseOverMe = false;
    this.selected = true; // Aktiv von Anfang an
    this.myTextSize = 20;
    //this.hoverSäule;
  }

  display() {
    fill(this.myColor);
    if (this.mouseOverMe) fill(this.myOverMeColor);

    strokeWeight(0);
    stroke(this.myStrokeColor);
    ellipse(this.myX, this.myY, this.mySize);

    if (this.selected) {
      fill(this.myStrokeColor);
      noStroke();
      ellipse(this.myX, this.myY, this.mySize - 10);
    }

    // 🔤 Titel rechts neben dem Button anzeigen
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(this.myTextSize);

    if (this.selected) {
      fill(this.myStrokeColor); // gleiche Farbe wie der Rahmen
    } else {
      fill(124, 139, 171); // z. B. grauer Text für deaktivierte
    }

    text(this.formatTitle(this.myTitle), this.myX + this.mySize / 2 + 10, this.myY - 4);
  }

  releasedOverMe() {
    if (this.mouseOverMe) {
      this.selected = !this.selected;
    }
  }

  // Optional: Formatierung des Titels (z. B. "christianity_all" → "Christianity")
  formatTitle(raw) {
    let cleaned = raw.replace('_all', '').toLowerCase();

    if (cleaned === 'noreligion') {
      return 'No Religion';
    }

    // Capitalize the first letter
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

}

class ReligionsBar {
  constructor(_religion, _height, _color) {
    this.myRel = _religion;
    this.height = _height;
    this.color = _color;
  }
}

class ReligionsBySingleRegion {
  constructor(_x, _y, _width, _height) {
    this.myX = _x;
    this.myY = _y;
    this.myWidth = _width;
    this.myHeight = _height;
    this.heightest = 0;
    this.bars = [];
    this.lineWidth = 15;
  }

  clear() {
    this.heightest = 0;
    this.bars = [];
  }

  update() {
    for (let bar of this.bars) {
      if (!activeReligions[bar.myRel]) {
        this.bars.splice(this.bars.indexOf(bar), 1);
      }
    }
    this.heightest = 0;
    for (let bar of this.bars) {
      if (bar.height > this.heightest) {
        this.heightest = bar.height;
      }
    }
  }

  add_data(religion, height, _color) {
    console.log(religion, height, _color);
    var new_bar = new ReligionsBar(religion, height, _color);

    for (let bar of this.bars) {
      if (bar.myRel == new_bar.myRel) {
        this.bars.splice(this.bars.indexOf(bar), 1);
      }
    }
    this.bars.push(new_bar);

    this.update();
  }

  remove_data(religion) {
    this.bars = this.bars.filter(bar => bar.myRel !== religion);
    this.update();
  }


  display() {
    let x = this.myX;
    for (let bar of this.bars) {
      fill(bar.color);
      //console.log(x, y);
      rect(x + 200, this.myY + 70, this.lineWidth, (bar.height / this.heightest) * this.myHeight * -1);
      // x += this.myWidth / this.bars.length;
      x += 30;

      //this.hoverSäule = mouseX > x + 180 && mouseX < x + 180 + this.lineWidth &&
      //mouseY > this.myY + 70 - (bar.height / this.heightest) * this.myHeight && mouseY < this.myY + 70;
      // if (this.hoverSäule) {
      //   console.log("hoverSäule", this.hoverSäule);
      // }
    }
   
    fill(124, 139, 171); // oder eine passendere Farbe
    noStroke();
    textAlign(LEFT, TOP);
    textSize(20);
    text("Absolute Number", this.myX + 195, this.myY + 85 + 10); // X = Start des Balkens, Y = knapp darunter


  }
}

class DataPointButton {
  constructor(_rel, _region_data, _x, _y, _sizeNormal, _sizeOverMe, _color) {
    this.myRel = _rel;
    this.myRegionData = _region_data;
    this.myX = _x;
    this.myY = _y;
    this.myRealX = _x + width / 2;
    this.myRealY = _y + height / 2;
    this.mySize = _sizeNormal;
    this.myColor = _color;
    this.myOverMeColor = color(255, 255, 255);
    this.myOverMeSize = _sizeOverMe;
    this.mouseOverMe = false;
    this.selected = false;
    this.absolute = this.myRegionData[this.myRel].absolute;
  }

  display() {

    fill(this.myColor); // Kreis-Füllung
    noStroke(); // Kreis-Rand
    strokeWeight(0); // Dünnerer Rand
    ellipse(this.myX, this.myY, this.mySize * 0.5, this.mySize * 0.5); // Durchmesser des Kreises


    if (this.mouseOverMe || this.selected) {

      noStroke()
      fill(red(this.myColor),
        green(this.myColor),
        blue(this.myColor),
        40);
      ellipse(this.myX, this.myY, this.myOverMeSize / 2, this.myOverMeSize / 2);
    }
    if (this.selected) {
      noStroke();
      fill(this.myColor);
      textAlign(LEFT);
      textSize(15);
      if (this.absolute < 1000) {
        let result = Math.round(this.absolute);
        let digitCount = result.toString().length;
        rect(this.myX + this.mySize + 10, this.myY, digitCount * 7 + 30, 25, 5);
        fill(19, 39, 82);
        text(this.absolute, this.myX + this.mySize + 15, this.myY + 10);
      }
      if (this.absolute >= 1000 && this.absolute < 1000000) {
        let resultk = Math.round(this.absolute / 1000);
        let digitCountk = resultk.toString().length;
        rect(this.myX + this.mySize + 10, this.myY, digitCountk * 7 + 30, 25, 5);
        fill(19, 39, 82);
        text(Math.round(this.absolute / 1000) + "k", this.myX + this.mySize + 15, this.myY + 10);
      }
      if (this.absolute >= 1000000 && this.absolute < 1000000000) {
        let resultM = Math.round(this.absolute / 1000000);
        let digitCountM = resultM.toString().length;
        rect(this.myX + 10, this.myY - 30, digitCountM * 7 + 30, 25, 5);
        fill(19, 39, 82);
        text(Math.round(this.absolute / 1000000) + "M", this.myX + 15, this.myY - 20);
      }
      if (this.absolute >= 1000000000) {
        let resultB = Math.round(this.absolute / 1000000000);
        let digitCountB = resultB.toString().length;
        rect(this.myX + this.mySize + 10, this.myY, digitCountB * 7 + 20, 25, 5);
        fill(19, 39, 82);
        text(Math.round(this.absolute / 1000000000) + "B", this.myX + this.mySize + 15, this.myY + 10);
      }

    }



  }


}