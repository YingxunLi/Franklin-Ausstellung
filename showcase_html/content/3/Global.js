//let barwidth = windowWidth - 200;
//let barheight = 30;

class Global {
    constructor ( ){
        //this.myYear = global.getString(g, "year");
        this.myYear = 0;
        this.myChristianity = 0;
        this.myJudaism = 0;
        this.myIslam = 0;
        this.myBuddhism = 0;
        this.myHinduism = 0;
        this.myNoreligion = 0;
        this.myPopulation = 0;
        this.myWorldPopulation = 0;
        this.myChristianitypercent = 0;
        this.myJudaismpercent = 0;
        this.myIslampercent = 0;
        this.myBuddhismpercent = 0;
        this.myHinduismpercent = 0;
        this.myNoreligionpercent = 0;
        
    }
    display() {
        // Hier kannst du die Logik zum Zeichnen des Objekts hinzufügen
        // Zum Beispiel:
        // fill(255, 0, 0);
        // noStroke();
        // rect(100, 100, barwidth * this.myChristianitypercent, barheight);
        // rect(100 + barwidth * this.myChristianitypercent, 100, barwidth * this.myJudaismpercent, barheight);
        push();
        
        //console.log(this.myYear);
        pop();
    }
}