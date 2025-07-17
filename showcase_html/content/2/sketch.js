let primaryEnergyData;
let renewablesData;
let co2Data;
const uiOffsetX = 120;

let animationProgress = 0;     // von 0 bis 1

let animationSpeed = 0.03; // 🐢 langsamerer Aufbau (ca. 4 Sekunden)
   // kannst du anpassen für langsamer/schneller

   

let hoveredCountryIndex = -1;

let countries = [
  "China", "United States", "India", "Russia", "Japan", "Germany", "Canada", "Brazil",
  "South Korea", "Iran", "Indonesia", "France", "Saudi Arabia", "United Kingdom", "Mexico",
  "Italy", "South Africa", "Australia", "Spain", "Turkey"
];

let radius = 120;
let barMax = 1100;
let slider;
let checkboxRenewable;
let checkboxCO2;
let playButton;


let isPlaying = false;
let currentYear = 2020;

let playButtonBounds = { x: 70, y: 450, size: 50 };





function preload() {
  primaryEnergyData = loadTable('primary-energy-consumption.csv', 'csv', 'header');
  renewablesData = loadTable('Erneuerbare_Energien.csv', 'csv', 'header');
  co2Data = loadTable('CO2_Emissions.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  textFont("Helvetica");
  textAlign(CENTER, CENTER);
  textSize(12);

  // 🎚️ Slider
  slider = createSlider(1990, 2020, 2020, 1);
  slider.style('width', '200px');
  slider.position(playButtonBounds.x + playButtonBounds.size + 20, playButtonBounds.y + 13);
  slider.class('custom-slider');

  // ▶️ Play-Button
  playButton = createDiv();
  playButton.class('checkbox-play');
  playButton.position(playButtonBounds.x, playButtonBounds.y);
  playButton.size(playButtonBounds.size, playButtonBounds.size);

  // ✅ 🌱 Renewable Energy Checkbox
  const renewableLabel = createDiv();
  renewableLabel.class('checkbox-style');
  renewableLabel.position(playButtonBounds.x - 5, playButtonBounds.y + 70);

  checkboxRenewable = createElement('input');
  checkboxRenewable.attribute('type', 'checkbox');
  checkboxRenewable.attribute('checked', '');
  checkboxRenewable.class('checkbox-input');
  checkboxRenewable.style('color', 'rgb(75, 208, 46)');
  renewableLabel.child(checkboxRenewable);

  const renewText = createSpan('Renewable Energy');
  renewText.style('font-family', 'Helvetica');
  renewText.style('color', 'rgb(209, 209, 209)');
  renewableLabel.child(renewText);

  // ✅ 💜 CO₂ Emissions Checkbox
  const co2Label = createDiv();
  co2Label.class('checkbox-style');
  co2Label.position(playButtonBounds.x - 5, playButtonBounds.y + 140);

  checkboxCO2 = createElement('input');
  checkboxCO2.attribute('type', 'checkbox');
  checkboxCO2.attribute('checked', '');
  checkboxCO2.class('checkbox-input');
  checkboxCO2.style('color', 'rgb(112, 71, 180)');
  co2Label.child(checkboxCO2);

  const co2Text = createSpan('CO2 Emissions');
  co2Text.style('font-family', 'Helvetica');
  co2Text.style('color', 'rgb(209, 209, 209)');
  co2Label.child(co2Text);

  // 🔴 Total Energy (Fake-Box) – gleich groß und linksbündig
  const totalLabel = createDiv();
  totalLabel.class('checkbox-style');
  totalLabel.position(playButtonBounds.x - 1, playButtonBounds.y + 270);


  const fakeBox = createDiv();
  fakeBox.class('checkbox-total-fake'); // Größe wird über CSS angepasst
  totalLabel.child(fakeBox);

  const totalText = createSpan('Total Energy Consumption');
  totalText.style('font-family', 'Helvetica');
  totalText.style('color', 'rgb(209, 209, 209)');
  totalLabel.child(totalText);
}



function draw() {
  background(0);
  let selectedYear = floor(currentYear);
  hoveredCountryIndex = -1;

  let diagramCenterX = width / 2;
  let diagramCenterY = height / 2 + 500;

  let mouseXTrans = mouseX - diagramCenterX;
  let mouseYTrans = mouseY - diagramCenterY;
  let mouseAngle = atan2(mouseYTrans, mouseXTrans);
  let mouseDist = dist(mouseX, mouseY, diagramCenterX, diagramCenterY);

  let angleStep = TWO_PI / countries.length;
  const fixedMaxEnergy = 40000;
  const fixedMaxCO2 = 10000000000;

  let consumption = [], renewables = [], co2 = [];



  if (animationProgress < 1) {
    animationProgress += animationSpeed;
    animationProgress = constrain(animationProgress, 0, 1);
  }
  let ease = pow(animationProgress, 1);
  
  

if (animationProgress < 1) {
  drawingContext.shadowBlur = 40;
  drawingContext.shadowColor = `rgba(52, 152, 219, ${1 - animationProgress})`; // fade out
} else {
  drawingContext.shadowBlur = 0;
}



  for (let c of countries) {
    let row = primaryEnergyData.findRows(c, 'Entity').find(r => int(r.get('Year')) === selectedYear);
    consumption.push(row ? float(row.get('Primary energy consumption (TWh)')) : 0);

    row = renewablesData.findRows(c, 'Entity').find(r => int(r.get('Year')) === selectedYear);
    renewables.push(row ? float(row.get('Total renewable energy (TWh)')) : 0);

    row = co2Data.findRows(c, 'Entity').find(r => int(r.get('Year')) === selectedYear);
    co2.push(row ? float(row.get('Annual CO₂ emissions')) : 0);
  }

  let shiftAngle = -PI / 20;

  for (let i = 0; i < countries.length; i++) {
    let angleStart = i * angleStep - HALF_PI + shiftAngle;
    let angleEnd = (i + 1) * angleStep - HALF_PI + shiftAngle;

    let totalLen = map(consumption[i], 0, fixedMaxEnergy, 0, barMax);
    let renewLen = map(renewables[i], 0, fixedMaxEnergy, 0, barMax);
    let hoverMaxLen = max(totalLen, renewLen);

    if (
      mouseDist > radius &&
      mouseDist < radius + hoverMaxLen &&
      isAngleBetween(mouseAngle, angleStart, angleEnd)
    ) {
      hoveredCountryIndex = i;
      break;
    }
  }

  if (isPlaying) {
    // Ziehe den Slider smooth nach rechts
    if (currentYear < 2020) {
      currentYear = lerp(currentYear, currentYear + 1, 0.2);
      slider.value(floor(currentYear));
    } else {
      // Am Ende stoppen
      isPlaying = false;
      playButton.removeClass('playing');
    }
  } else {
    // Manuelles Nachziehen, wenn Slider per Hand bewegt wird
    currentYear = lerp(currentYear, slider.value(), 0.2);
  }
  

  translate(diagramCenterX, diagramCenterY);

  // 📏 Gt-Skalierung links – gleiche Höhe & Größe wie TWh
  if (checkboxCO2.elt.checked) {

  let fixedCO2Values = [2, 4, 6, 8, 10]; // Gt-Stufen
  textAlign(CENTER, CENTER);
  textSize(24);
  fill(80, 50, 130); // oder z. B. (90, 60, 150)


  for (let val of fixedCO2Values) {
    let r = map(val * 1e9, 0, fixedMaxCO2, 0, barMax);

    // Position links vom Halbkreis, gleiche Höhe wie TWh (y = 20)
    let x = -(radius + r);
    let y = 20;

    // Markerlinie (optional)
    stroke(112, 71, 180);
    strokeWeight(1);
    line(x, y - 6, x, y + 6);

    // Text
    noStroke();
    text(`${val} Gt`, x, y);
  }
}


  let fixedEnergyValues = [10000, 20000, 30000, 40000];
  for (let val of fixedEnergyValues) {
    let r = map(val, 0, fixedMaxEnergy, 0, barMax);
    stroke(100);
    noFill();
    beginShape();
    for (let a = PI; a <= TWO_PI; a += 0.01) {
      vertex((radius + r) * cos(a), (radius + r) * sin(a));
    }
    endShape();

    fill(100);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(24);
    text(`${val} TWh`, (radius + r), 20);
  }




  if (checkboxCO2.elt.checked) {
    let fixedCO2Values = [2, 4, 6, 8, 10];
    for (let val of fixedCO2Values) {
      let r = map(val * 1e9, 0, fixedMaxCO2, 0, barMax);
  
      // Farbe abhängig vom Hover
      if (hoveredCountryIndex !== -1) {
        stroke(90);         // dunklerer Ring bei Hover auf anderes Land
        fill(90);
      } else {
        stroke(61, 33, 110); // Standardfarbe
        strokeWeight(2);
        fill(61, 33, 110);
      }
  
      noFill();
      beginShape();
      for (let a = PI; a <= TWO_PI; a += 0.01) {
        vertex((radius + r) * cos(a), (radius + r) * sin(a));
      }
      endShape();
  
      // Text
      noStroke();
      textSize(24);
      textAlign(CENTER, CENTER);
      let x = (radius + r) * cos(PI);
      let y = (radius + r) * sin(PI) + 16;
  
      // Gleiche Farbe wie oben
      text(`${val} Gt`, x - 5, y);
    }
  }
  

  for (let i = 0; i < countries.length; i++) {
    let angle = i * angleStep - HALF_PI;
    let totalLen = map(consumption[i], 0, fixedMaxEnergy, 0, barMax) * ease;
    let renewLen = map(renewables[i], 0, fixedMaxEnergy, 0, barMax) * ease;
    let co2Len = map(co2[i], 0, fixedMaxCO2, 0, barMax) * ease;
    
    
    

    push();
    rotate(angle);
    if (true) {
      if (hoveredCountryIndex === i) {
        fill(255, 80, 80); // helleres Rot beim Hover
      } else if (hoveredCountryIndex !== -1) {
        fill(140, 30, 30); // dunkleres Rot bei Fokus woanders
      } else {
        fill(139, 45, 45); // ← DEIN RGB-Farbwert (standard)
      }
      noStroke();
      rect(radius, -angleStep * 28, totalLen, angleStep * 28);
    }
    
    
    
    
    
    

// 🟢 RENEWABLE ENERGY BALKEN
if (checkboxRenewable.elt.checked) {
  if (hoveredCountryIndex === i) {
    fill(100, 255, 100); // Helleres Grün beim Hover (kann so bleiben oder anpassen)
  } else if (hoveredCountryIndex !== -1) {
    fill(40, 140, 40); // Abgedunkelt wenn Fokus woanders
  } else {
    fill(78, 255, 78); // ← DEIN RGB-Farbwert (Standard)
  }

  noStroke();
  rect(radius, -angleStep * 28, renewLen, angleStep * 28);
}


// 🟣 CO₂ BALKEN
if (checkboxCO2.elt.checked) {

  if (hoveredCountryIndex === i) {
    fill(150, 100, 230); // Helleres Lila
  } else if (hoveredCountryIndex !== -1) {
    fill(40, 20, 80); // Dunkleres Lila
  } else {
    fill(61, 33, 110); // Standard
  }
  
  noStroke();
  rect(radius, angleStep * 1, co2Len, angleStep * 28);
}




    pop();
  }

  if (hoveredCountryIndex !== -1) {
    push();
    let value = consumption[hoveredCountryIndex];
    let renew = renewables[hoveredCountryIndex];
    let co2Val = co2[hoveredCountryIndex];
    
    // Berechne Position auf Höhe von 10.000 TWh
    let fixedRing = 10000;
    let fixedRadius = map(fixedRing, 0, fixedMaxEnergy, 0, barMax);
    let angle = hoveredCountryIndex * angleStep - HALF_PI + angleStep / 2;
    
    let x = cos(angle) * (radius + fixedRadius + 30); // etwas weiter außen
    let y = sin(angle) * (radius + fixedRadius + 30);
    
    let tooltipWidth = 350;
    let tooltipHeight = 180;
    
    let boxX = x - tooltipWidth / 2;
    let boxY = y - tooltipHeight / 2;
    


    
    // Bigger textbox
    fill(30, 30, 30);
    stroke(209, 209, 209);
    strokeWeight(1.5);
    rect(x - 140, y - 80, 350, 180, 16);


  
   // Tooltip Text mit Punkten & mehr Abstand
fill(209, 209, 209);
noStroke();
textAlign(LEFT, TOP);
textSize(24);
let lineHeight = 34;

// Country (kein Punkt davor)
text(`Country: ${countries[hoveredCountryIndex]}`, x - 95, y - 50);

// 🔴 Total (roter Punkt)
fill(204, 46, 46); // Rot
ellipse(x - 95, y - 50 + lineHeight + 9, 10, 10); // kleiner Kreis
fill(209, 209, 209);
text(`Total: ${nf(value, 0, 0)} TWh`, x - 80, y - 50 + lineHeight);

// 🟢 Renewable (grüner Punkt)
fill(75, 208, 46); // Grün
ellipse(x - 95, y - 50 + lineHeight * 2 + 9, 10, 10);
fill(209, 209, 209);
text(`Renewable: ${nf(renew, 0, 0)} TWh`, x - 80, y - 50 + lineHeight * 2);

// 🟣 CO2 (lila Punkt)
fill(112, 71, 180); // Lila
ellipse(x - 95, y - 50 + lineHeight * 3 + 9, 10, 10);
fill(209, 209, 209);
text(`CO₂: ${nf(co2Val / 1e9, 1, 1)} Gt`, x - 80, y - 50 + lineHeight * 3);

  } 
  

  fill(209, 209, 209);
  textSize(40);          // ← größer!
  textStyle(NORMAL);       // ← optional, aber juicy
  textAlign(CENTER, CENTER);
  text(selectedYear, 0, 0);
  

  resetMatrix();
  fill(209, 209, 209);
  textAlign(LEFT, TOP);
  textSize(80);
  textStyle(BOLD);
  text("Global Energy Consumption", 50, 40);
  textSize(40);
  textStyle(BOLD);
  text("(1990–2020)", 60, 160);
  textSize(16);

 
}

function drawLegend() {
  const legendX = 80; // mehr Abstand zum Rand
  const legendY = height - 80; // höher gesetzt
  const boxSize = 36; // richtig große Farbkacheln
  const spacing = 550; // viel Platz zwischen den Kategorien

  noStroke();
  textAlign(LEFT, CENTER);
  textSize(28); // großer, klarer Text

  // Total Energy
  fill(139, 45, 45);
  rect(legendX, legendY, boxSize, boxSize, 6);
  fill(209, 209, 209);
  text("total energy consumption", legendX + boxSize + 16, legendY + boxSize / 2);

  // Renewable Energy
  fill(78, 255, 78);
  const renewX = legendX + spacing;
  rect(renewX, legendY, boxSize, boxSize, 6);
  fill(209, 209, 209);
  text("renewable energy consumption", renewX + boxSize + 16, legendY + boxSize / 2);

  // CO₂ Emissions
  fill(61, 33, 110);
  const co2X = legendX + spacing * 2 - 50;
  rect(co2X, legendY, boxSize, boxSize, 6);
  fill(209, 209, 209);
  text("CO2 emissions", co2X + boxSize + 16, legendY + boxSize / 2);
}


function drawCustomPlayButton() {
  const { x, y, size } = playButtonBounds;


  
  stroke(220);
  strokeWeight(3);
  fill(0);
  rect(x, y, size, size, 8);

  noStroke();
  fill(209, 209, 209);
  const pad = 100;

  fill(230);
noStroke();
beginShape();
vertex(x + pad + 2, y + pad + 4);
bezierVertex(
  x + pad + 2, y + pad + 4,
  x + size - pad - 6, y + size / 2 - 4,
  x + pad + 2, y + size - pad - 4
);
endShape(CLOSE);
  } 
 


  function mousePressed() {
    const { x, y, size } = playButtonBounds;
    if (
      mouseX >= x && mouseX <= x + size &&
      mouseY >= y && mouseY <= y + size
    ) {
      if (!isPlaying) {
        // Starte von vorne
        currentYear = 1990;
        slider.value(1990);
        playButton.addClass('playing');
      } else {
        playButton.removeClass('playing');
      }
  
      isPlaying = !isPlaying;
    }
  }
  
  

function isAngleBetween(test, start, end) {
  test = (test + TWO_PI) % TWO_PI;
  start = (start + TWO_PI) % TWO_PI;
  end = (end + TWO_PI) % TWO_PI;

  if (start < end) {
    return test >= start && test <= end;
  } else {
    return test >= start || test <= end;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
