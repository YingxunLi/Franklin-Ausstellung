// ======= Globale Variablen =======
let continentColors = {};
let highlightColors = {};
let continents = ["Africa", "America", "Asia", "Europe", "Oceania"];
let data = [];
let countries = [];
let years = [];
let includedCountries = [
    "Sweden", "Norway", "Finland", "Iceland", "Estonia", "Germany", "France",
  "Netherlands", "Switzerland", "Austria", "Ireland", "Portugal", "Spain", "Poland",
  "Hungary", "Czechia", "Greece", "Italy",

  "South Africa", "Ghana", "Namibia", "Senegal", "Botswana", "Cape Verde", "Tunisia",
  "Liberia", "Kenya", "Malawi", "Nigeria", "Sierra Leone", "Zambia", "Ethiopia",
  "Morocco", "Uganda", "Algeria", "Sudan", "Zimbabwe", "Rwanda",

  "Japan", "South Korea", "Taiwan", "India", "Philippines", "Indonesia", "Malaysia",
  "Mongolia", "Thailand", "Nepal", "Bangladesh", "Sri Lanka", "Kazakhstan", "Uzbekistan",
  "Vietnam", "Myanmar", "Pakistan", "Afghanistan", "Iran", "China",

  "Australia", "New Zealand", "Fiji", "Papua New Guinea", "Solomon Islands",
  "Vanuatu",
  "New Caledonia", "Timor",

  "Canada", "United States", "Mexico", "Cuba", "Haiti", "Dominican Republic", "Jamaica",
  "Colombia", "Venezuela", "Brazil", "Argentina", "Chile", "Peru", "Ecuador",
  "Bolivia", "Paraguay", "Uruguay", "Nicaragua", "El Salvador", "Honduras"
];

let groupedByContinent = {};

let activeContinents = {};


// ======= Daten vorbereiten (CSV laden) =======
function preload() {
  table = loadTable('data/BLIBLA.csv', 'csv', 'header');
  console.log("Columns: ", table.columns);
  console.log("Rows: ", table.rows.length);
}

// ======= Daten filtern =======
function filterDataByYearAndContinent(year) {
  let filteredData = [];
  for (let row of table.rows) {
    let country = row.get("Country");
    let continent = row.get("Continent");
    let score = float(row.get("FreedomScore"));
    let rowYear = int(row.get("Year"));
    if (continents.includes(continent) && includedCountries.includes(country) &&
        activeContinents[continent] && rowYear === year) {
      let entry = { country, continent, score, year: rowYear };
      filteredData.push(entry);
      groupedByContinent[continent].push(entry);
    }
  }
  return filteredData;
}

// ======= Initialisierung der Umgebung =======
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  Slider.setup();
  PlayButton.setup();

  for (let row of table.rows) {
    console.log(row.get("Country"), row.get("Continent"), row.get("FreedomScore"), row.get("Year"));
  }
  console.log("Columns: ", table.columns);
  console.log("Rows: ", table.getRowCount());
  console.log("Filtered data:", data);

  // Farben für Kontinente definieren
  let palette = [
    color("hsl(33, 100%, 37%)"), // F29F37 (Africa)
    color("hsl(282, 100%, 37%)"), // A702F4 (America)
    color("hsl(193, 100%, 37%)"), // 0401F1 (Asia)
    color("hsl(340, 96%, 37%)"), // F7045C (Europe)
    color("hsl(57, 99%, 37%)"), // FEFA06 (Oceania)
  ];
  for (let i = 0; i < continents.length; i++) {
    continentColors[continents[i]] = palette[i];
    groupedByContinent[continents[i]] = [];
  }
  
  // Hervorhebungsfarben definieren
  let change = [
    color("hsl(33, 100%, 63%)"), // F29F37 (Africa)
    color("hsl(282, 100%, 50%)"), // A702F4 (America)
    color("hsl(193, 100%, 53%)"), // 0401F1 (Asia)
    color("hsl(340, 96%, 50%)"), // F7045C (Europe)
    color("hsl(57, 99%, 51%)"), // FEFA06 (Oceania)
  ];
  for (let i = 0; i < continents.length; i++) {
    highlightColors[continents[i]] = change[i];
    groupedByContinent[continents[i]] = [];
  }

  // 初始化 groupedByContinent
  for (let continent of continents) {
    groupedByContinent[continent] = [];
  }

  // 数据过滤
  data = filterDataByYearAndContinent(Slider.getCurrentYear());

  // 初始化 activeContinents
  for (let continent of continents) {
    activeContinents[continent] = true;
  }
  
  loop();
}

// ======= Hauptzeichnungsfunktion =======
function draw() {
  background(0);

  Slider.draw();
  PlayButton.draw();

  hoveredData = null;

  selectedYear = Slider.getCurrentYear();

  // 清空 groupedByContinent 并重新过滤数据
  for (let continent of continents) {
    groupedByContinent[continent] = [];
  }
  data = filterDataByYearAndContinent(selectedYear);

  // ======= Layoutparameter für Balken und Linien =======
  let xLeft = 120;
  let xRight = width - 80;
  let barWidth = 5;
  let topMargin = 60;
  let continentYMap = {};
  let gap = 4;
  let totalHeight = (height - 2 * topMargin) * 0.8;
  let continentBarHeight = totalHeight / continents.length;

  // ======= Kontinent-Balken zeichnen =======
  for (let i = 0; i < continents.length; i++) {
    let continent = continents[i];
    let entries = groupedByContinent[continent];
    let yTop = topMargin + i * (continentBarHeight+ gap);
    noStroke();
    let barColor = activeContinents[continent]
    ? continentColors[continent]
    : color(100);
    fill(barColor);    
    rect(xLeft, yTop, barWidth, continentBarHeight);

    // Kontinentname (vertikal)
    push();
    translate(xLeft - 15, yTop + continentBarHeight / 2); 
    rotate(-HALF_PI);
    fill(255);
    textAlign(CENTER, CENTER);
    textFont("Barlow Semi Condensed");
    textSize(18);
    text(continent, 0, 0);  
    pop(); 

    // y-Positionen für Linien berechnen
    let spacing = continentBarHeight / (entries.length + 1);
    continentYMap[continent] = entries.map((_, idx) => yTop + (idx + 1) * spacing);
  }

  // ======= Gesamtscore-Balken (rechte Seite) =======
  let selectedCountriesData = data.filter(entry => includedCountries.includes(entry.country));
  let totalScore = selectedCountriesData.reduce((sum, entry) => sum + entry.score, 0);
  let alpha = map(totalScore, 0, 85, 50, 255);
  alpha = constrain(alpha, 50, 255);
  fill(255, 255, 255, alpha);
  rect(xRight - barWidth, topMargin, barWidth, totalHeight);
    
  // Score-Anzeige (vertikaler Text)
  push();
  translate(xRight + 30, topMargin + totalHeight / 2);
  rotate(-HALF_PI);
  fill(255);
  textAlign(CENTER, CENTER);
  textFont("Barlow Semi Condensed");
  textSize(16);
  text(`In ${selectedYear}, total score: ${totalScore.toFixed(2)}`, 0, 0);
  pop();
    
  // Skalenmarkierungen
  fill(255);
  textAlign(CENTER, BOTTOM);
  textSize(12);
  text("1", xRight - barWidth / 2, topMargin - 5);
  textAlign(CENTER, TOP);
  text("0", xRight - barWidth / 2, topMargin + totalHeight + 5);

  // ======= Linien zwischen Kontinent und Score =======
  hoveredData = null; 
  for (let continent of continents) {
    if (!activeContinents[continent]) continue; // Nur aktive Kontinente zeichnen
    let continentEntries = data.filter(d => d.continent === continent);
    let yPositions = continentYMap[continent];
    let spacing = (yPositions[yPositions.length - 1] - yPositions[0]) / (continentEntries.length + 1);

    for (let i = 0; i < continentEntries.length; i++) {
      let d = continentEntries[i];
      let score = d.score;

      let y1 = yPositions[0] + (i + 1) * spacing;
      let y2 = map(score, 0, 1, (height - topMargin) * 0.8, topMargin);
      let x1 = xLeft + barWidth;
      let x2 = xRight - barWidth;

      // Hover-Erkennung 1
      for (let t = 0; t <= 1; t += 0.05) {
        let bx = bezierPoint(x1, (x1 + x2) / 2, (x1 + x2) / 2, x2, t);
        let by = bezierPoint(y1, y1, y2, y2, t);
        let d = dist(mouseX, mouseY, bx, by);
        if (d < 10) { 
          hoveredData = { x1, y1, x2, y2, lineColor: continentColors[continent], score };
          break;
        }
      }
      
      // Linie zeichnen
      if (hoveredData && hoveredData.x1 === x1 && hoveredData.y1 === y1 && hoveredData.x2 === x2 && hoveredData.y2 === y2) {
        stroke(highlightColors[continent]);
        strokeWeight(2); 
      } else {
        stroke(continentColors[continent]);
        strokeWeight(1); 
      }
  
      noFill();
      bezier(x1, y1, (x1 + x2) / 2, y1, (x1 + x2) / 2, y2, x2, y2);

      // Hover-Erkennung 2
      for (let t = 0; t <= 1; t += 0.05) { 
        let bx = bezierPoint(x1, (x1 + x2) / 2, (x1 + x2) / 2, x2, t);
        let by = bezierPoint(y1, y1, y2, y2, t);
        let d = dist(mouseX, mouseY, bx, by);
        if (d < 10) { 
          hoveredData = { 
            x: mouseX, 
            y: mouseY, 
            country: continentEntries[i].country, 
            year: continentEntries[i].year, 
            score: continentEntries[i].score 
          };            
          break;
        }
      }
    }
  }

  // info box
  if (hoveredData) {
    let { x, y, country, year, score } = hoveredData;
  
    let boxWidth = 170;
    let boxHeight = 50;
  
    fill(70, 70, 70, 150); 
    noStroke();
    rect(x + 10, y + 10, boxWidth, boxHeight, 3);
  
    fill(255);
    textAlign(LEFT, TOP);
    textSize(12);
  
    text(`Country: ${country}`, x + 15, y + 15);
    text(`Year: ${year}`, x + 15, y + 30);
    text(`Score: ${score.toFixed(2)}`, x + 15, y + 45);
  }
}


function mousePressed() {
  if (PlayButton.isMouseOver()) {
    PlayButton.toggle();
  } else {
    Slider.mousePressed();
  }

  let xLeft = 120;
  let barWidth = 5;
  let topMargin = 60;
  let gap = 4;
  let totalHeight = (height - 2 * topMargin) * 0.8;
  let continentBarHeight = totalHeight / continents.length;

  for (let i = 0; i < continents.length; i++) {
    let continent = continents[i];
    let yTop = topMargin + i * (continentBarHeight + gap);

    if (mouseX >= xLeft && mouseX <= xLeft + barWidth &&
        mouseY >= yTop && mouseY <= yTop + continentBarHeight) {
      activeContinents[continent] = !activeContinents[continent];
      break;
    }
  }
}

function mouseDragged() {
  Slider.mouseDragged();
}

function mouseReleased() {
  Slider.mouseReleased();
}
