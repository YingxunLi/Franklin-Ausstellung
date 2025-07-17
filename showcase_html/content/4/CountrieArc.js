/*
created by franklin hernandez-castro, www.skizata.com
tec costa rica, hfg sch.gmünd
2019
 */

class CountryArc {
    constructor ( _diam, _firstA, _finalA){
        this.myCountry = "NaN";
        this.myCountryArea = 0;
        this.myCountryISO = "NaN";
        this.myWidth = 100;
        this.myColor = color(random(0, 360), 80, 100); // zufälliger Wert von 0  bis 360, 50 Sättigung, 100 Helligkeit
        this.estaEncima = false;

        this.diameter = _diam;
        this.myFirtsAngle = _firstA;
        this.myFinalAngle = _finalA;
    }


    display(myX, myY){
         this.estaEncima = this.isItOverMe(myX, myY);
        // drawing the arc
        noFill();
        stroke(this.myColor);
        strokeWeight(this.myWidth);
        arc(myX, myY, this.diameter, this.diameter, this.myFirtsAngle, this.myFinalAngle);

        if (this.estaEncima) {
            fill (0);
            noStroke();
            text(this.myCountryArea, myX-10, myY+40);
            text(this.myCountry, myX-10, myY+10); 
        }
        noStroke();
    } // end of display




    isItOverMe (myX, myY){
        let distanceToCenter = dist (mouseX, mouseY, myX, myY);

        push();
        translate(myX, myY);
        let a = atan2(mouseY-myY, mouseX-myX);
        pop();

        if (a<0) a = map(a, -PI, 0, PI, TWO_PI);
         return (distanceToCenter > this.diameter / 2 - this.myWidth / 2
             && distanceToCenter < this.diameter / 2 + this.myWidth / 2
             && a > this.myFirtsAngle
             && a < this.myFinalAngle);
    } // end of isItOverMe


}  // end of class