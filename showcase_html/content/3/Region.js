class Religion {
  constructor(table) {
    this.table = table;
    this.dataByRegion = [];
    this.dataPoints = [];
    this.maxRadius = 340;
    this.angleStep = 0;
    this.singleRegionBars = new ReligionsBySingleRegion(this.maxRadius + 200, this.maxRadius, width / 2 - this.maxRadius + 100, 2 * this.maxRadius);
    this.lastYear = 0;
  }

  update(year) {
    
    let selectedBefore = this.dataPoints.filter(p => p.selected);
  
    this.dataByRegion = [];
  
    regions.forEach(region => {
      let rows = this.table.findRows(region, 'region');
      let row = rows.find(r => r.get('year') === String(year));
  
      if (row) {
        let pop = float(row.get('population'));
        let entry = { region: region };
  
        religions.forEach(rel => {
          let val = float(row.get(rel));
          entry[rel] = {
            percent: pop > 0 ? (val / pop) * 100 : 0,
            absolute: val
          };
        });
  
        this.dataByRegion.push(entry);
      }
    });
  
    this.angleStep = 360 / this.dataByRegion.length;
  
    this.dataPoints = [];
  
    religions.forEach(rel => {
      for (let i = 0; i < this.dataByRegion.length; i++) {
        let angle = -90 + i * this.angleStep;
        let percent = this.dataByRegion[i][rel].percent;
        let radius = map(percent, 0, 100, 0, this.maxRadius);
        let x = cos(angle) * radius;
        let y = sin(angle) * radius;
  
        let point = new DataPointButton(rel, this.dataByRegion[i], x, y, 20, 40, colorsStroke[rel]);
        this.dataPoints.push(point);
      }
    });
  
    // Balkenanzeige zurücksetzen
    this.singleRegionBars.clear();
  
    // Reaktivieren, was vorher ausgewählt war
    this.dataPoints.forEach(p => {
      for (let oldP of selectedBefore) {
        if (
          p.myRel === oldP.myRel &&
          p.myRegionData.region === oldP.myRegionData.region
        ) {
          p.selected = true;
          this.singleRegionBars.add_data(
            p.myRel,
            p.myRegionData[p.myRel].absolute,
            p.myColor
          );
        }
      }
    });
  
    this.lastYear = year;
  }
  

  display() {
    if (this.dataByRegion.length === 0) return;

    // Hintergrund-Skalierung
    noFill();
    textSize(16);
    textAlign(LEFT, CENTER + 1);
    for (let p = 20; p <= 100; p += 20) {
      let r = map(p, 0, 100, 0, this.maxRadius);
      strokeWeight(4); // <-- HIER angepasst
      stroke(40, 58, 98);
      strokeWeight(4);
      noFill();
      ellipse(0, 0, r * 2, r * 2);

      // Text separat danach zeichnen
      let labelX = cos(-90) * r;
      let labelY = sin(-90) * r;
      noStroke();
      fill(124, 139, 171);
      text(p, labelX + 5, labelY + 25);
    }

    // Achsen & Labels
    stroke(40, 58, 98);
    textAlign(CENTER, CENTER);
    textSize(20);
    for (let i = 0; i < this.dataByRegion.length; i++) {
      let angle = -90 + i * this.angleStep;
      let x = cos(angle) * this.maxRadius * 1.0;
      let y = sin(angle) * this.maxRadius * 1.0;
      stroke(40, 58, 98);
      strokeWeight(4);
      line(0, 0, x, y);

      // Kreis am Ende der Linie
      fill(40, 58, 98); // oder eine andere Farbe, z. B. fill(0, 200, 255)
      noStroke();
      ellipse(x, y, 10, 10); // letzter Wert = Durchmesser des Kreises

      let regionName = this.dataByRegion[i].region;
      let isRegionSelected = this.dataPoints.some(dp => dp.selected && dp.myRegionData.region === regionName);

      // Farbe je nach Auswahl
      if (isRegionSelected) {
        fill(255); // Weiß wenn aktiv
      } else {
        fill(124, 139, 171); // Sonst Standardgrau
      }

      // Positionierung wie gehabt
      if (i == 0) y = y - 5;
      if (i == 1) textAlign(LEFT, CENTER), y = y - 10, x = x - 10;
      if (i == 2) textAlign(LEFT, TOP), y = y - 20;
      if (i == 3) textAlign(RIGHT, TOP), y = y - 20;
      if (i == 4) textAlign(RIGHT, CENTER), y = y - 10, x = x + 10;

      // Text zeichnen
      text(regionName, x * 1.10, y * 1.10);


    }

    // Datenlinien
    religions.forEach(rel => {
      if (!activeReligions[rel]) return;

      // --- Flächenstil ---
      stroke(colorsStroke[rel]);
      strokeWeight(4);
      fill(colors[rel]);

      beginShape();
      for (let i = 0; i < this.dataByRegion.length; i++) {
        let angle = -90 + i * this.angleStep;
        let percent = this.dataByRegion[i][rel].percent;
        let radius = map(percent, 0, 100, 0, this.maxRadius);
        let x = cos(angle) * radius;
        let y = sin(angle) * radius;
        vertex(x, y);
      }
      endShape(CLOSE);

      // --- Kreise separat zeichnen ---
      for (let i = 0; i < this.dataPoints.length; ++i) {
        if (activeReligions[this.dataPoints[i].myRel]) {
          this.dataPoints[i].display();
        }
      }
    });

    this.singleRegionBars.display();

  }
}
