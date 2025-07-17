let table;
let countries = [];
let libreExtraLight;
let libreThin;
let libreMedium;
let libreRegular;
let libreBold;
let globalMaxUsers = 0;
let totalInternetUsers = 0;
let selectedYear = 1990;
let sliderStartX = 500;
let sliderEndX = 1100;
let sliderY;
let skipButton;
let backButton;
let isDragging = false;
let highlightedSegments = {
  Europe: false,
  Asia: false,
  Africa: false,
  America: false
};
let segmentHitboxes = [];

let isPlaying = false;
let lastFrameTime = 0;
let yearStart = 1990;
let yearEnd = 2020;
let selectedCountries = []; // enthält die Länder, die per Checkbox ausgewählt wurden
const countryCodesToNames = {
  "DEU": "Germany",
  "FRA": "France",
  "GBR": "United Kingdom",
  "ITA": "Italy",
  "ESP": "Spain",
  "NLD": "Netherlands",
  "SWE": "Sweden",
  "FIN": "Finland",
  "NOR": "Norway",
  "DNK": "Denmark",
  "PRT": "Portugal",
  "GRC": "Greece",
  "RUS": "Russia", 
  "TUR": "Turkey",

  "CHN": "China",
  "IND": "India",
  "JPN": "Japan",
  "KOR": "South Korea",
  "NPL": "Nepal",
  "IDN": "Indonesia",
  "THA": "Thailand",
  "SAU": "Saudi Arabia",
  "VNM": "Vietnam",
  "PHL": "Philippines",
  "SGP": "Singapore",
  "MMR": "Myanmar",
  "MYS": "Malaysia",
  "MNG": "Mongolia",

  "NGA": "Nigeria",
  "EGY": "Egypt",
  "DZA": "Algeria",
  "KEN": "Kenya",
  "ETH": "Ethiopia",
  "TUN": "Tunisia",
  "UGA": "Uganda",
  "SDN": "Sudan",
  "GHA": "Ghana",
  "TZA": "Tanzania",
  "ZAF": "South Africa",
  "SEN": "Senegal",
  "MAR": "Morocco",
  "MLI": "Mali",

  "USA": "United States",
  "CAN": "Canada",
  "MEX": "Mexico",
  "BRA": "Brazil",
  "ARG": "Argentina",
  "COL": "Colombia",
  "PER": "Peru",
  "CHL": "Chile",
  "VEN": "Venezuela",
  "URY": "Uruguay",
  "PRY": "Paraguay",
  "CUB": "Cuba",
  "BOL": "Bolivia",
  "PAN": "Panama"
};


//let showMaxCheckbox;
//let showMinCheckbox;

let continentDropdowns = {};
let continentVisible = {};

let continents = {
  "Europe": ["DEU", "FRA", "GBR", "ITA", "ESP", "NLD", "SWE", "FIN", "NOR", "DNK", "PRT", "GRC", "RUS", "TUR"],
  "Asia": ["CHN", "IND", "JPN", "KOR", "NPL", "IDN", "THA", "SAU", "VNM", "PHL", "SGP", "MMR", "MYS", "MNG" ],
  "Africa": ["NGA", "EGY", "DZA", "KEN", "ETH", "TUN", "UGA", "SDN", "GHA", "TZA", "ZAF", "SEN", "MAR", "MLI"],
  "America": ["USA", "CAN", "MEX", "BRA", "BOL", "COL", "PER", "CHL", "VEN", "URY", "PRY", "CUB", "ARG", "PAN"]

};

let continentColors = {
  "Europe": [199, 31, 96],
  "Asia": [331, 32, 89],
  "Africa": [50, 40, 100],
  "America": [99, 34, 72],
};

let continentColorsDark = {
  "Europe": [206, 35, 63],
  "Asia": [320, 34, 58],
  "Africa": [41, 26, 62],
  "America": [143, 25, 46],
};

function preload() {
  table = loadTable('data/Global_Internet_Use_original.csv', 'csv', 'header');

  libreExtraLight = loadFont('data/fonts/LibreFranklin-ExtraLight.ttf');
  libreThin = loadFont('data/fonts/LibreFranklin-Thin.ttf');
  libreMedium = loadFont('data/fonts/LibreFranklin-Medium.ttf');
  libreRegular = loadFont('data/fonts/LibreFranklin-Regular.ttf');
  libreBold = loadFont('data/fonts/LibreFranklin-Bold.ttf');
}


function calculateGlobalMaxUsers() {
  let maxUsers = 0;
  for (let r = 0; r < table.getRowCount(); r++) {
    let users = int(table.getString(r, "Internet Users(%)"));
    if (!isNaN(users)) {
      maxUsers = max(maxUsers, users);
    }
  }
  return maxUsers;
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  angleMode(RADIANS);
  textFont(libreRegular);

  let sliderWidth = min(width * 0.6, 700);
  sliderStartX = width / 2 - sliderWidth / 2;
  sliderEndX = width / 2 + sliderWidth / 2;
  sliderY = height - 95;

  playButton = createButton("▶");
  playButton.size(30, 30);
  playButton.style("color", '#686570');
  playButton.style("background-color", '#070711');
  playButton.style("border-radius", "50%");
  playButton.style("border", "none");
  playButton.position(width / 2 - 14, sliderY + 20);
  playButton.style("cursor", "pointer");
  playButton.style("font-family", '"Libre Franklin", sans-serif');
  playButton.style("font-size", "20px");
  playButton.mousePressed(togglePlay);
  

  resetButton = createButton("❘⯇");
  resetButton.size(50, 30);
  resetButton.style("color", '#686570');
  resetButton.style("background-color", '#070711');
  resetButton.position(width / 2 - 74, sliderY + 20);
  resetButton.style('font-family', 'LibreFranklin-Regular');
  resetButton.style("font-size", "20px");
  resetButton.style("border", "none");
  resetButton.style("cursor", "pointer");
  resetButton.style("letter-spacing", "-5px");
  resetButton.mousePressed(resetTimeline);

  skipButton = createButton("⯈❘"); 
  skipButton.size(50, 30);
  skipButton.style("color", '#686570');
  skipButton.style("background-color", '#070711');
  skipButton.position(width / 2 + 21, sliderY + 20);
  skipButton.style("border", "none");
  skipButton.style('font-family', 'LibreFranklin-Regular');
  skipButton.style("font-size", "20px");
  skipButton.style("cursor", "pointer");
  skipButton.style("letter-spacing", "-5px");


  skipButton.mousePressed(() => {
  selectedYear = yearEnd; // Jahr 2020
});


  
  

  globalMaxUsers = calculateGlobalMaxUsers(); // <-- hinzugefügt

  loadYearData(selectedYear);
  sortCountriesByContinent();
  setupContinentDropdowns();
}

function setupContinentDropdowns() {
  const baseY = 150;
  const spacingLabel = 32;
  const spacingCheckbox = 28;

  let continentOrder = Object.keys(continents);
  let labelElements = {};
  let checkboxElements = {};

  function redrawLayout() {
    let currentY = baseY;

    continentOrder.forEach((cont) => {
      labelElements[cont].position(100, currentY);
      currentY += spacingLabel;

      let checkboxes = checkboxElements[cont];
      if (continentVisible[cont]) {
        for (let cb of checkboxes) {
          cb.position(120, currentY);
          cb.style('display', 'inline-block');
          currentY += spacingCheckbox;
        }
      } else {
        for (let cb of checkboxes) {
          cb.style('display', 'none');
        }
      }
    });
  }

  // Initialisierung aller Kontinente
  continentOrder.forEach((cont) => {
    continentVisible[cont] = false;
    checkboxElements[cont] = [];

    let label = createElement('h4', "▸ " + cont);
    label.style('color', '#686570');
    label.style('font-family', 'LibreFranklin-Regular');
    label.style('font-weight', '400'); 
    label.style('font-size', '18px');
    label.style('margin', '0');
    label.style('cursor', 'pointer');

    label.mousePressed(() => {
      continentVisible[cont] = !continentVisible[cont];
      label.html((continentVisible[cont] ? "▾" : "▸") + " " + cont);
      redrawLayout();
    });

    labelElements[cont] = label;

    // Länder alphabetisch sortieren
    let sortedCodes = continents[cont]
      .filter(code => countryCodesToNames[code])
      .sort((a, b) => countryCodesToNames[a].localeCompare(countryCodesToNames[b]));

    for (let code of sortedCodes) {
      let country = countryCodesToNames[code];

      let cb = createCheckbox(country, false);
      cb.style('color', '#686570');
      cb.style('font-family', 'LibreFranklin-Regular');
      cb.style('font-size', '16px');
      cb.elt.querySelector('input').style.transform = 'scale(1.3)';
      cb.elt.querySelector('input').style.accentColor = '#9D99A7';
      cb.elt.querySelector('label').style.marginLeft = '8px';
      cb.style('display', 'none');

      cb.changed(() => {
        if (cb.checked()) {
          if (!selectedCountries.includes(country)) {
            selectedCountries.push(country);
          }
        } else {
          selectedCountries = selectedCountries.filter(c => c !== country);
        }
      });

      checkboxElements[cont].push(cb);
    }
  });

  redrawLayout();

  backButton = createButton("↺");
  backButton.position(300, baseY - 10);
  backButton.style("background-color", "transparent");
  backButton.style("border", "none");
  backButton.style("color", "#686570");
  backButton.style("font-size", "30px");
  backButton.style("font-family", 'LibreFranklin-Regular');
  backButton.style("cursor", "pointer");
  backButton.style("transform", "rotate(-40deg)");
  backButton.hide();

  backButton.mousePressed(() => {
    selectedCountries = [];

    for (let cont in checkboxElements) {
      checkboxElements[cont].forEach(cb => {
        cb.checked(false);
      });
    }
  });
}



function togglePlay() {
  isPlaying = !isPlaying;
  playButton.html(isPlaying ? "❚❚" : "▶");
}

function draw() {
  background(237, 58, 7, 100);

  if (selectedCountries.length > 0) {
    backButton.show();
  } else {
    backButton.hide();
  }

  if (isPlaying && millis() - lastFrameTime > 150) {
    if (selectedYear < yearEnd) {
      selectedYear++;
    } else {
      isPlaying = false;
      playButton.html("▶");
    }
    lastFrameTime = millis();
  }

  loadYearData(selectedYear);
  sortCountriesByContinent();
  drawData();
  drawSlider();
  drawTitle();
  drawContinentBar();
  drawTotalInternetUsers();
  drawSelectedContinentUsers();
}

function drawData() {
  translate(width / 2, height / 2 -35);

  // Hilfskreise
  noFill();
  stroke(249, 27, 31);
  strokeWeight(0.8);
  ellipse(0, 0, 370, 370);
  ellipse(0, 0, 530, 530);
  ellipse(0, 0, 690, 690);
// Prozentzahlen auf den Kreisen anzeigen mit Hintergrund-Rechteck
const outerRadius = 350;

const labelPercents = [
  { r: 185, text: "50%" },
  { r: 265, text: "75%" },
  { r: 345, text: "100%" }
];


for (let item of labelPercents) {
  let x = 0;
  let y = -item.r;

  // Hintergrund-Rechteck (dunkle Fläche über Kreis)
  fill(237, 58, 7, 100);  // dieselbe Farbe wie dein Hintergrund
  noStroke();
  rectMode(CENTER);
  rect(x, y, 50, 28);

  // Text drauf
  fill(249, 27, 31);
  textFont(libreRegular);
  textAlign(CENTER, CENTER);
  textSize(14);
  text(item.text, x, y);
}

  let angleStep = TWO_PI / countries.length;
  let minLen = 20;
  let maxLen = 345;
  let maxUsers = globalMaxUsers;

  let mx = mouseX - width / 2;
  let my = mouseY - (height / 2 -35);

  let hoveredCountry = null;

  for (let i = 0; i < countries.length; i++) {
    let country = countries[i];
    let countryName = country.name;
  
    let shouldDraw = selectedCountries.length === 0 || selectedCountries.includes(countryName);
    if (!shouldDraw) continue;
  
    let angle = i * angleStep;
    let len = map(country.users, 0, maxUsers, minLen, maxLen);
    let x = cos(angle) * len;
    let y = sin(angle) * len;
  
    let d = dist(mx, my, x, y);
    let hovered = d < 10;
  
    let col = continentColors[country.continent];
    stroke(col[0], col[1], col[2]);
    strokeWeight(hovered ? 6 : 0.7);
    line(0, 0, x, y);
  
    // ➕ Kreis an Linienende
    noStroke();
    fill(col[0], col[1], col[2]);
    ellipse(x, y, hovered ? 15 : 5); // größer bei Hover
  
    if (hovered) {
      hoveredCountry = {
        ...country,
        col
      };
    }
  }

  // Tooltip
  resetMatrix(); // Wichtig: Koordinaten zurücksetzen
  rectMode(CORNER);
  textAlign(LEFT, BASELINE);
  drawCurvedContinentLabels();
  drawPlayButtonCircle();

  if (hoveredCountry) {
    let tooltipX = mouseX + 20;
    let tooltipY = mouseY + 10;

    fill(237, 58, 7);
    noStroke();
    rect(tooltipX - 5, tooltipY - 25, 160, 60, 8);

    fill(hoveredCountry.col[0], hoveredCountry.col[1], hoveredCountry.col[2]);
    textFont(libreBold);
    textSize(18);
    textStyle(BOLD);
    textAlign(LEFT, BASELINE);
    text(hoveredCountry.name, tooltipX + 10, tooltipY );

    fill(255);
    textFont(libreRegular);
    textSize(15);
    text(nf(hoveredCountry.users, 1, 1) + "%", tooltipX + 10, tooltipY + 25);
  }
}
  

function drawSlider() {
  let t = map(selectedYear, yearStart, yearEnd, sliderStartX, sliderEndX);

  stroke('#272533');
  strokeWeight(2);
  line(sliderStartX, sliderY, sliderEndX, sliderY);

  fill('#686570');
  noStroke();
  ellipse(t, sliderY, 12, 12);

  // 👉 Text-Zustand ganz gezielt setzen
  push(); // 💾 speichert aktuellen Zustand

  textAlign(CENTER, BASELINE);  // CENTER oder besser BASELINE
  textFont(libreRegular);
  textStyle(NORMAL);
  textSize(15);
  fill('#686570');
  text(selectedYear, t, sliderY - 20);

  pop(); // 🔄 stellt vorherige Einstellungen wieder her
}


function mousePressed() {
  let t = map(selectedYear, yearStart, yearEnd, sliderStartX, sliderEndX);
  if (dist(mouseX, mouseY, t, sliderY) < 15) {
    isDragging = true;
  }

  // 🔁 Klick auf Balkensegmente toggeln
  for (let seg of segmentHitboxes) {
    if (
      mouseX >= seg.x &&
      mouseX <= seg.x + seg.w &&
      mouseY >= seg.y &&
      mouseY <= seg.y + seg.h
    ) {
      let wasActive = highlightedSegments[seg.name];
  
      // Alle auf false setzen
      for (let key in highlightedSegments) {
        highlightedSegments[key] = false;
      }
  
      // Wenn er vorher nicht aktiv war, jetzt aktivieren
      if (!wasActive) {
        highlightedSegments[seg.name] = true;
      }
  
      break;
    }
  }  
  
}

function mouseReleased() {
  isDragging = false;
}

function mouseDragged() {
  if (isDragging) {
    let x = constrain(mouseX, sliderStartX, sliderEndX);
    selectedYear = int(map(x, sliderStartX, sliderEndX, yearStart, yearEnd));
  }
}

function drawTitle() {
  fill(257, 8, 65);
  noStroke();
  textFont(libreThin); 
  textSize(35);
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
  text("Internet usage", 100, 60);
}

function loadYearData(year) {
  countries = [];
  totalInternetUsers = 0;
  

  for (let r = 0; r < table.getRowCount(); r++) {
    let rowYear = int(table.getString(r, "Year"));
    if (rowYear !== year) continue;

    let name = table.getString(r, "Entity");
    let code = table.getString(r, "Code");

    let percent = parseFloat(table.getString(r, "Internet Users(%)"));
    let absolute = parseFloat(table.getString(r, "No. of Internet Users"));

    // Linie nur zeichnen, wenn Prozentsatz vorhanden
    if (!isNaN(percent) && percent >= 1 && code.length === 3) {
      let continent = getContinent(code);
      if (continent) {
        countries.push({ name, code, users: percent, continent, absolute });
    
        // ✅ Nur jetzt aufsummieren, wenn das Land wirklich verwendet wird
        if (!isNaN(absolute) && absolute > 0) {
          totalInternetUsers += absolute;
        }
      }
    }
  }
}

function getInternetUsersByContinent() {
  let usersPerContinent = {
    Europe: 0,
    Asia: 0,
    Africa: 0,
    America: 0
  };

  for (let country of countries) {
    if (usersPerContinent.hasOwnProperty(country.continent)) {
      if (!isNaN(country.absolute)) {
        usersPerContinent[country.continent] += country.absolute;
      }
    }
  }

  return usersPerContinent;
}

function sortCountriesByContinent() {
  let sorted = [];
  let order = ["Asia", "Europe", "Africa", "America"];
  for (let c of order) {
    for (let country of countries) {
      if (country.continent === c) {
        sorted.push(country);
      }
    }
  }
  countries = sorted;
}

function getContinent(code) {
  for (let cont in continents) {
    if (continents[cont].includes(code)) return cont;
  }
  return null;
}
function drawContinentBar() {
  const barWidth = 190;
  const barHeight = 20;
  const gap = 6;

  const centerX = width - 270;
  const centerY = height / 2 - 140;
  const barY = centerY - barHeight / 2;

  const usersPerContinent = getInternetUsersByContinent();
  const total = Object.values(usersPerContinent).reduce((a, b) => a + b, 0);
  if (total === 0) return;

  segmentHitboxes.length = 0;
  let currentX = centerX - barWidth / 7;

  push(); // 🛡️ Grafikstil merken
  noFill();

  for (let cont of ["Africa", "Europe", "America", "Asia"]) {
    const col = continentColorsDark[cont];
    const val = usersPerContinent[cont] || 0;
    const share = val / total;
    const segmentWidth = share * (barWidth - 3 * gap);

    // Hover-Erkennung
    const isHovered = mouseX >= currentX &&
                      mouseX <= currentX + segmentWidth &&
                      mouseY >= barY &&
                      mouseY <= barY + barHeight;

    const isActive = highlightedSegments[cont];

    // Style
    stroke(col[0], col[1], col[2]);
    strokeWeight(isActive || isHovered ? 3 : 0.8);

    if (isActive) {
      stroke(col[0], col[1], col[2]);
    } else {
      noFill(); // sonst nur Umriss
    }

    rect(currentX, barY, segmentWidth, barHeight, 3); // leicht abgerundete Ecken

    // Klickfläche merken
    segmentHitboxes.push({
      x: currentX,
      y: barY,
      w: segmentWidth,
      h: barHeight,
      name: cont
    });

    currentX += segmentWidth + gap;
  }

  pop(); // 🔄 Grafikstil zurücksetzen
}




function drawTotalInternetUsers() {
  let x = width - 230;
  let y = height / 2 - 55;

  if (totalInternetUsers > 0) {
    fill('#686570');
    textAlign(RIGHT);
    textFont(libreRegular);

    // Zahl
    textSize(28);
    text(nfc(totalInternetUsers).replace(/,/g, '.'), x + 125, y - 20);

    // Beschriftung
    textSize(15);
    text("Users worldwide", x + 125, y + 17);
  }

}
function drawSelectedContinentUsers() {
  const usersPerContinent = getInternetUsersByContinent();
  let selected = Object.keys(highlightedSegments).find(k => highlightedSegments[k]);

  if (!selected) return; // nichts ausgewählt → nichts anzeigen

  let value = usersPerContinent[selected];
  if (!value || value === 0) return;

  let x = width - 230;
  let y = height / 2 - 40;

  fill(continentColorsDark[selected][0], continentColorsDark[selected][1], continentColorsDark[selected][2]);
  textAlign(RIGHT);
  textFont(libreRegular);
  textSize(28);
  text(nfc(value, 0).replace(/,/g, '.'), x + 125, y + 58);

  textSize(15);
  text(`Users ${selected}`, x + 125, y + 95);
}


function drawCurvedContinentLabels() {
  const labels = [
    { name: "America", angle: radians(315) },
    { name: "Asia", angle: radians(45) },
    { name: "Europe", angle: radians(135) },
    { name: "Africa", angle: radians(225) },
  ];

  const r = 380; // <- passt perfekt zur größten Ellipse (355 Radius) + etwas Abstand

  textFont(libreRegular);
  textSize(15);
  textAlign(CENTER, CENTER);
  noStroke();

  for (let l of labels) {
    const txt = l.name;
    const baseAngle = l.angle;

    let col = continentColorsDark[l.name];
    fill(col[0], col[1], col[2]);


    push();
    translate(width / 2, height / 2 - 35); // <- Zentrum auch um 50 nach oben verschoben

    let arcLength = txt.length * 16;
    let startAngle = baseAngle - arcLength / (2 * r);

    let drawReversed = (sin(baseAngle) > 0);
    let chars = drawReversed ? txt.split("").reverse() : txt.split("");

    for (let i = 0; i < chars.length; i++) {
      let char = chars[i];
      let theta = startAngle + (i * 16) / r;

      let x = cos(theta) * r;
      let y = sin(theta) * r;

      push();
      translate(x, y);

      if (drawReversed) {
        rotate(theta - HALF_PI);
      } else {
        rotate(theta + HALF_PI);
      }

      text(char, 0, 0);
      pop();
    }

    pop();
  }
}

function resetTimeline() {
  selectedYear = yearStart;
  isPlaying = false;
  playButton.html("▶");
}
function drawPlayButtonCircle() {
  const btnX = width / 2;
  const btnY = sliderY + 37; // Position angepasst (Play-Button ist 30px hoch + Abstand)

  noFill();
  stroke('#686570');
  strokeWeight(1.2);
  ellipse(btnX, btnY, 40, 40);
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  let sliderWidth = min(width * 0.6, 600);
  sliderStartX = width / 2 - sliderWidth / 2;
  sliderEndX = width / 2 + sliderWidth / 2;
  sliderY = height -80;

  // Repositioniere Buttons und Checkboxen dynamisch
  playButton.position(width / 2 - 14, sliderY + 20);
  resetButton.position(width / 2 - 74, sliderY + 20);
  skipButton.position(width / 2 + 21, sliderY + 20);


  showMaxCheckbox.position(60, 260);
  showMinCheckbox.position(60, 300);
}