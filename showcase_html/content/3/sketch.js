let table;
let religions = ['christianity_all', 'islam_all', 'buddhism_all', 'hinduism_all', 'noreligion_all'];
let colors;
let colorsStroke;
let regions;
let years;
//let yearSlider;
let mySlider;
let previousYear;
let showedReligionsChanged;
let activeReligions = {};
let myButton = {};
let religion;
let myFont;

// Lennox Code
let year = [];
let christianity = [];
let judaism = [];
let islam = [];
let buddhism = [];
let hinduism = [];
let noreligion = [];
let population = [];
let worldpopulation = [];
let myGlobalreligions = [];

let currentGlobal;

let x = 100;   // VOLÄUFIG !! HIER MUSS NOCH DER WERT AUS DER DATENBANK REIN
let christianityX;
let judaismX;
let islamX;
let buddhismX;
let hinduismX;
let noreligionX;
let otherX;

let barWidth;
let christianityWidth;
let judaismWidth;
let islamWidth;
let buddhismWidth;
let hinduismWidth;
let noreligionWidth;
let otherWidth;

let y = 150;
let v = 3;

let Schriftgröße = 20;

function preload() {
  table = loadTable('data/Sortierte_Daten_nach_Regionen.csv', 'csv', 'header');
  myFont = loadFont('data/Poppins-SemiBold.ttf');

  // Lennox Code

  globalReligions = loadJSON("data/global.json");
  //myFont = loadFont("data/Poppins-SemiBold.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(myFont);
  angleMode(DEGREES);

  colors = {
    christianity_all: color(255, 220, 116, 100),
    islam_all: color(255, 123, 123, 100),
    buddhism_all: color(116, 255, 151, 100),
    hinduism_all: color(227, 151, 255, 100),
    noreligion_all: color(103, 232, 255, 100)
  };

  colorsStroke = {
    christianity_all: color(255, 220, 116),
    islam_all: color(255, 123, 123),
    buddhism_all: color(116, 255, 151),
    hinduism_all: color(227, 151, 255),
    noreligion_all: color(103, 232, 255)
  };

  regions = [...new Set(table.getColumn('region'))];
  let mideastIndex = regions.indexOf('mideast');
  let europeIndex = regions.indexOf('Europe');
  if (mideastIndex !== -1 && europeIndex !== -1) {
    [regions[mideastIndex], regions[europeIndex]] = [regions[europeIndex], regions[mideastIndex]];
  }

  years = [...new Set(table.getColumn('year'))].map(Number).sort((a, b) => a - b);

  //yearSlider = createSlider(0, years.length - 1, 0, 1);
  //yearSlider.position(10, 10);
  //yearSlider.style('width', '300px');
  //yearSlider.input(updateData);
  let sliderWidth = windowWidth / 2;
  let sliderX = (windowWidth - sliderWidth) / 2;
  mySlider = new Slider(sliderX, windowHeight - 140, sliderWidth, 20, 0, 13, 0, "", 5);

  religions.forEach((rel, i) => {
    activeReligions[rel] = true;
    let x = 110;
    let y = 300 + i * 50;
    let s = 20;
    let btn = new Button(x, y, s, rel);
    btn.myColor = colors[rel];

    btn.myStrokeColor = colorsStroke[rel];

    // 👇 wichtig: direkt als ausgewählt markieren
    btn.selected = true;

    myButton[rel] = btn;
  });

  religion = new Religion(table);
  //updateData();

  // Lennox Code
  textFont(myFont);
  barWidth = windowWidth - 200;
  // console.log(globalReligions);                 // Sollte ein Objekt mit `global` sein
  //console.log(globalReligions.global);          // Sollte ein Array sein
  // console.log(globalReligions.global.length);
  // Diese Funktion wird einmal zu Beginn ausgeführt

  //mySlider = new Slider(200, 180, 400, 20, 0, 255, 127, "color");

  numOfGlobal = 14;

  //console.log("globalReligions.length : " + globalReligions.length);
  //console.log("numOfGlobal : " + numOfGlobal);

  for (let g = 0; g < numOfGlobal; g++) {
    let currentGlobal = new Global();
    year = globalReligions.global[g].year;
    currentGlobal.myYear = globalReligions.global[g].year;
    currentGlobal.myChristianity = globalReligions.global[g].christianity_all;
    currentGlobal.myJudaism = globalReligions.global[g].judaism_all;
    currentGlobal.myIslam = globalReligions.global[g].islam_all;
    currentGlobal.myBuddhism = globalReligions.global[g].buddhism_all;
    currentGlobal.myHinduism = globalReligions.global[g].hinduism_all;
    currentGlobal.myNoreligion = globalReligions.global[g].noreligion_all;
    currentGlobal.myPopulation = globalReligions.global[g].population;
    currentGlobal.myWorldPopulation = globalReligions.global[g].world_population;
    currentGlobal.myChristianitypercent = globalReligions.global[g].christianity_percent;
    currentGlobal.myJudaismpercent = globalReligions.global[g].judaism_percent;
    currentGlobal.myIslampercent = globalReligions.global[g].islam_percent;
    currentGlobal.myBuddhismpercent = globalReligions.global[g].buddhism_percent;
    currentGlobal.myHinduismpercent = globalReligions.global[g].hinduism_percent;
    currentGlobal.myNoreligionpercent = globalReligions.global[g].noreligion_percent;
    myGlobalreligions[g] = currentGlobal;


  }
  //console.log(myGlobalreligions);
  //console.log(myGlobalreligions[0].myChristianity);
}

function draw() {


  if (previousYear != mySlider.getCurrentYear()) {
    previousYear = mySlider.getCurrentYear();
    religion.update(mySlider.getCurrentYear());
  }  //console.log(mySlider.getCurrentYear());

  // Lennox Code    
  let myYear = mySlider.myValue;
  //console.log("myYear : " + myYear);
  otherReligions = myGlobalreligions[myYear].myWorldPopulation - (myGlobalreligions[myYear].myChristianity + myGlobalreligions[myYear].myIslam + myGlobalreligions[myYear].myBuddhism + myGlobalreligions[myYear].myHinduism + myGlobalreligions[myYear].myNoreligion);
  worldpopulation = myGlobalreligions[myYear].myWorldPopulation - otherReligions;
  christianityWidth = barWidth * myGlobalreligions[myYear].myChristianity / worldpopulation;
  islamWidth = barWidth * myGlobalreligions[myYear].myIslam / worldpopulation;
  buddhismWidth = barWidth * myGlobalreligions[myYear].myBuddhism / worldpopulation;
  hinduismWidth = barWidth * myGlobalreligions[myYear].myHinduism / worldpopulation;
  noreligionWidth = barWidth * myGlobalreligions[myYear].myNoreligion / worldpopulation;
  otherWidth = barWidth * otherReligions / worldpopulation;
  //console.log("christianityWidth : " + christianityWidth);

  christianityX = 100;
  islamX = christianityX + christianityWidth;
  buddhismX = islamX + islamWidth;
  hinduismX = buddhismX + buddhismWidth;
  noreligionX = hinduismX + hinduismWidth;
  otherX = noreligionX + noreligionWidth;
  //console.log(myYear);

  // Ina Code

  background(19, 39, 82);

  mySlider.render();

  // Buttons anzeigen (bleiben links)
  for (let rel of religions) {
    myButton[rel].display();
  }

  // Diagramm zentrieren
  push();
  translate(width / 2, height / 2);  // <<< Verschiebt Ursprung ins Zentrum
  religion.display();
  pop();

  // Lennox Codestroke(0, 0, 0);
  strokeWeight(0);
  //noStroke();
  fill(255, 220, 116);
  rect(christianityX, y, christianityWidth, 15);
  fill(255, 123, 123);
  rect(islamX, y, islamWidth, 15);
  fill(116, 255, 151);
  rect(buddhismX, y, buddhismWidth, 15);
  fill(227, 151, 255);
  rect(hinduismX, y, hinduismWidth, 15);
  fill(103, 232, 255);
  rect(noreligionX, y, noreligionWidth, 15);


  // stroke(255, 255, 255);
  // strokeWeight(2);
  // line(windowWidth - 70, windowHeight - 70, windowWidth - 90, windowHeight - 70);
  // line(windowWidth - 100, windowHeight - 70, windowWidth - 120, windowHeight - 70);
  // line(windowWidth - 130, windowHeight - 70, windowWidth - 150, windowHeight - 70);
  // line(windowWidth - 160, windowHeight - 70, windowWidth - 180, windowHeight - 70);
  // line(windowWidth - 190, windowHeight - 70, windowWidth - 210, windowHeight - 70);

  //PROBE ANFANG 
  // fill(255, 220, 116);
  // rect(windowWidth - 300, windowHeight - 70, 30, - myGlobalreligions[myYear].myChristianity / 5000000);
  // fill(255, 123, 123);
  // rect(windowWidth - 260, windowHeight - 70, 30, - myGlobalreligions[myYear].myIslam / 5000000);
  // fill(116, 255, 151);
  // rect(windowWidth - 220, windowHeight - 70, 30, - myGlobalreligions[myYear].myBuddhism / 5000000);
  // fill(227, 151, 255);
  // rect(windowWidth - 180, windowHeight - 70, 30, - myGlobalreligions[myYear].myHinduism / 5000000);
  // fill(103, 232, 255);
  // rect(windowWidth - 140, windowHeight - 70, 30, - myGlobalreligions[myYear].myNoreligion / 5000000);

  //PROBE ENDE 
  // Diese Funktion wird kontinuierlich ausgeführt
  // Hier kannst du deine Zeichenlogik hinzufügen

  //CHristianity Hover
  this.hoverCristianity = mouseX > christianityX && mouseX < christianityX + christianityWidth &&
    mouseY > y - 15 / 2 && mouseY < y + 15;
  if (this.hoverCristianity == true) {
    fill(255, 220, 116);
    rect(christianityX - v, y - v, christianityWidth + 2 * v, 15 + 2 * v);
    textAlign(LEFT);
    textSize(Schriftgröße);
    if (myGlobalreligions[myYear].myChristianity < 1000000000) {
      text("Christianity  |  " + Math.round(myGlobalreligions[myYear].myChristianity / 1000000) + "  M", christianityX + 10, y + 40);
      //onsole.log(myGlobalreligions[myYear].myChristianity);
    }
    if (myGlobalreligions[myYear].myChristianity >= 1000000000) {
      text("Christianity  |  " + Math.floor(myGlobalreligions[myYear].myChristianity / 1000000000) + ", " + ((Math.round(myGlobalreligions[myYear].myChristianity / 1000000)) - (Math.floor(myGlobalreligions[myYear].myChristianity / 1000000000) * 1000)) + "  B", christianityX + 10, y + 40);
    }
  }

  //Islam Hover
  this.hoverIslam = mouseX > islamX && mouseX < islamX + islamWidth &&
    mouseY > y - 15 / 2 && mouseY < y + 15;
  if (this.hoverIslam == true) {
    fill(255, 123, 123);
    rect(islamX - v, y - v, islamWidth + 2 * v, 15 + 2 * v);
    textAlign(LEFT);
    textSize(Schriftgröße);
    if (myGlobalreligions[myYear].myIslam < 1000000000) {
      text("Islam  |  " + Math.round(myGlobalreligions[myYear].myIslam / 1000000) + "  M", islamX + 10, y + 40);
      //console.log(myGlobalreligions[myYear].myIslam);
    }
    if (myGlobalreligions[myYear].myIslam >= 1000000000) {
      text("Islam  |  " + Math.floor(myGlobalreligions[myYear].myIslam / 1000000000) + ", " + ((Math.round(myGlobalreligions[myYear].myIslam / 1000000)) - (Math.floor(myGlobalreligions[myYear].myIslam / 1000000000) * 1000)) + "  B", islamX + 10, y + 40);
    }
  }

  //Buddhism Hover
  this.hoverBuddhism = mouseX > buddhismX && mouseX < buddhismX + buddhismWidth &&
    mouseY > y - 15 / 2 && mouseY < y + 15;
  if (this.hoverBuddhism == true) {
    fill(116, 255, 151);
    rect(buddhismX - v, y - v, buddhismWidth + 2 * v, 15 + 2 * v);
    textAlign(LEFT);
    textSize(Schriftgröße);
    if (myGlobalreligions[myYear].myBuddhism < 1000000000) {
      text("Buddhism  |  " + Math.round(myGlobalreligions[myYear].myBuddhism / 1000000) + "  M", buddhismX + 10, y + 40);
      //console.log(myGlobalreligions[myYear].myBuddhism);
    }
    if (myGlobalreligions[myYear].myBuddhism >= 1000000000) {
      text("Buddhism  |  " + Math.floor(myGlobalreligions[myYear].myBuddhism / 1000000000) + ", " + ((Math.round(myGlobalreligions[myYear].myBuddhism / 1000000)) - (Math.floor(myGlobalreligions[myYear].myBuddhism / 1000000000) * 1000)) + "  B", buddhismX + 10, y + 40);
    }
  }

  //Hinduism Hover
  this.hoverHinduism = mouseX > hinduismX && mouseX < hinduismX + hinduismWidth &&
    mouseY > y - 15 / 2 && mouseY < y + 15;
  if (this.hoverHinduism == true) {
    fill(227, 151, 255);
    rect(hinduismX - v, y - v, hinduismWidth + 2 * v, 15 + 2 * v);
    textAlign(LEFT);
    textSize(Schriftgröße);
    if (myGlobalreligions[myYear].myHinduism < 1000000000) {
      text("Hinduism  |  " + Math.round(myGlobalreligions[myYear].myHinduism / 1000000) + "  M", hinduismX + 10, y + 40);
      //console.log(myGlobalreligions[myYear].myHinduism);
    }
    if (myGlobalreligions[myYear].myHinduism >= 1000000000) {
      text("Hinduism  |  " + Math.floor(myGlobalreligions[myYear].myHinduism / 1000000000) + ", " + ((Math.round(myGlobalreligions[myYear].myHinduism / 1000000)) - (Math.floor(myGlobalreligions[myYear].myHinduism / 1000000000) * 1000)) + "  B", hinduismX + 10, y + 40);
    }
  }

  //Noreligion Hover
  this.hoverNoreligion = mouseX > noreligionX && mouseX < noreligionX + noreligionWidth &&
    mouseY > y - 15 / 2 && mouseY < y + 15;
  if (this.hoverNoreligion == true) {
    fill(103, 232, 255);
    rect(noreligionX - v, y - v, noreligionWidth + 2 * v, 15 + 2 * v);
    textAlign(LEFT);
    textSize(Schriftgröße);
    if (myGlobalreligions[myYear].myNoreligion < 1000000000) {
      text("No Religion  |  " + Math.round(myGlobalreligions[myYear].myNoreligion / 1000000) + "  M", noreligionX + 10, y + 40);
      //console.log(myGlobalreligions[myYear].myNoreligion);
    }
    if (myGlobalreligions[myYear].myNoreligion >= 1000000000) {
      text("No Religion  |  " + Math.floor(myGlobalreligions[myYear].myNoreligion / 1000000000) + ", " + ((Math.round(myGlobalreligions[myYear].myNoreligion / 1000000)) - (Math.floor(myGlobalreligions[myYear].myNoreligion / 1000000000) * 1000)) + "  B", noreligionX + 10, y + 40);
    }
  }
  // noLoop();

  fill(124, 139, 171); // oder eine passendere Farbe
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  text("Absolute Number", this.myX + 200, this.myY + 70 + 10); // X = Start des Balkens, Y = knapp darunter


  fill(255); // Weiße Schrift
  textAlign(LEFT);
  textSize(50);
  text("World Religions 2010 – 1945", 100, 60);

}



function updateData() {
  //religion.update(years[yearSlider.value()]);
  religion.update(mySlider.getCurrentYear());
  redraw();
}

function mouseReleased() {
  console.log("mouseReleased");
  for (let rel of religions) {
    let btn = myButton[rel]; // ✅ richtiges Objekt!
    let wasSelected = btn.selected;
    btn.releasedOverMe();
    if (btn.selected !== wasSelected) {
      activeReligions[rel] = btn.selected;
      updateData(); // wichtig, um die Visualisierung sofort zu aktualisieren
    }
  }

  for (let dp of religion.dataPoints) {
    if (activeReligions[dp.myRel]) {
      let d = dist(mouseX, mouseY, dp.myRealX, dp.myRealY);
      if (d < dp.mySize / 2) {
        console.log("Clicked", dp.myRel, dp.myRegionData);

        if (dp.selected) {
          // Abwählen + Säule löschen
          dp.selected = false;
          religion.singleRegionBars.remove_data(dp.myRel);
        } else {
          // Andere Punkte dieser Religion abwählen
          for (let d of religion.dataPoints) {
            if (d.myRel === dp.myRel) {
              d.selected = false;
            }
          }
          dp.selected = true;
          religion.singleRegionBars.add_data(dp.myRel, dp.myRegionData[dp.myRel].absolute, dp.myColor);
        }

        break;
      }
    }
  }

  mySlider.mouseReleasedMe();
}

function mousePressed() {
  mySlider.mouseClickMe();
}

function mouseDragged() {
  mySlider.mouseDraggingMe();
}

function mouseMoved() {
  for (let rel of religions) {
    let btn = myButton[rel];
    let d = dist(mouseX, mouseY, btn.myX, btn.myY);
    btn.mouseOverMe = d < btn.mySize / 2;
  }

  for (let dp of religion.dataPoints) {
    let d = dist(mouseX, mouseY, dp.myRealX, dp.myRealY);
    dp.mouseOverMe = d < dp.mySize / 2;
  }
}