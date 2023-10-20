/*jslint this:true*/
/*jslint for:true*/
/*jslint long:true*/

// Variables du document à déclarer
var jsonCode = document.getElementById("jsonCode");
var jsonCode2 = document.getElementById("jsonCode2");
var speed = document.getElementById('speed');

//Variables pour les méthodes

var exportBool1=false;
var exportBool2=false;

//On déclare une variable globale du modèle

var modele;
modele = new Model();


// OBJET POINT

function Point(x,y){
    Object.defineProperty(this, "x",{
        configurable: false,
        enumerable: true,
        value: x,
        writable: false
    });
    Object.defineProperty(this, "y",{
        configurable: false,
        enumerable: true,
        value: y,
        writable: false
    });
}

Point.prototype.horizontalSymmetry = function(n){
    var ecart = Math.abs(this.y-n);
    if(this.y === 0){
        return new Point(this.x,n+n);
    }
    if(n ==0){
        return new Point(this.x,-this.y);
    }
    if(this.y>n){
        return new Point(this.x, n-ecart);
    }
    else if(this.y == n){
        return new Point(this.x,this.y);
    }
    else{
        return new Point(this.x, n+ecart);
    }
};

Point.prototype.verticalSymmetry = function(n){
    var ecart = Math.abs(this.x-n);
    if(this.x === 0){
        return new Point(n+n,this.y);
    }
    if(n == 0){
        return new Point(-this.x,this.y);
    }
    if(this.x > n){
        return new Point(n-ecart,this.y);
    }
    else if(this.x == n){
        return new Point(this.x,this.y);
    }
    else{
        return new Point(n+ecart,this.y);
    }



};

Point.prototype.average = function(p,alpha){
    var moyenneX = (1-alpha)*this.x+alpha*p.x;
    var moyenneY = (1-alpha)*this.y+alpha*p.y;
    moyenneX=Math.round(moyenneX);
    moyenneY=Math.round(moyenneY);
    return new Point(moyenneX,moyenneY);
};

Point.prototype.clone = function(p){
    return new Point(p.x,p.y);
};


// OBJET SEGMENT

function Segment(p1,p2){
    Object.defineProperty(this, "p1",{
        configurable: false,
        enumerable: true,
        value: p1,
        writable: false
    });
    Object.defineProperty(this, "p2",{
        configurable: false,
        enumerable: true,
        value: p2,
        writable: false
    });
}


Segment.prototype.horizontalSymmetry = function(n){
    return new Segment(this.p1.horizontalSymmetry(n),this.p2.horizontalSymmetry(n));

};

Segment.prototype.verticalSymmetry = function(n){
    return new Segment(this.p1.verticalSymmetry(n),this.p2.verticalSymmetry(n));

};

Segment.prototype.average = function(s,alpha){
    return new Segment(this.p1.average(s.p1,alpha),this.p2.average(s.p2,alpha));
};

// OBJET Model

function Model(){

    // Liste des segments des canvas 1 et 2
    this.l1 = [];
    this.l2 = [];

    // Liste des segments des canvas 3 et 4
    this.tmpl1 = this.l1.map((x) => x);
    this.tmpl2 = this.l2.map((x) => x);

    // Points actuels pour chaque canvas

    this.points1 = [undefined, undefined];
    this.points2 = [undefined, undefined];

    // Couleurs pour les canvas

    this.couleur = "#4488EE";

    // Vitesse de l'animation

    this.speed = speed.value;


}

Object.defineProperty(Model.prototype, "setSpeed", {
    set: function(s){
        this.speed=s;
    }
});

Model.prototype.repaint = function(nb){
    //Méthode qui appelle la méthode paint en fonction du canvas que l'on souhaite modifié
    if(nb == 1){
        this.paint(ctx,this.l1);
    }
    if(nb == 2){
        this.paint(ctx2,this.l2);
    }
    if(nb == 3){
        this.paint(ctx3, this.tmpl1);
    }
    if(nb == 4){
        this.paint(ctx4,this.tmpl2);
    }
};

Model.prototype.paint = function(ctx,tabSeg){
    // Méthode qui permet d'afficher le modèle

    this.tmpl1 = this.l1.map((x) => x);
    this.tmpl2 = this.l2.map((x) => x);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    for(var i = 0; i < tabSeg.length; i++){
        if(i == 0){
            ctx.beginPath();
            ctx.moveTo(tabSeg[0].p1.x, tabSeg[0].p1.y);
            ctx.lineTo(tabSeg[i].p2.x,tabSeg[i].p2.y);
            ctx.strokeStyle= this.couleur; //Nuance de bleu
            ctx.lineWidth= 3;
            ctx.stroke();

        }
        else if(tabSeg[i-1].p2.x != tabSeg[i].p1.x && tabSeg[i-1].p2.y != tabSeg[i].p1.y){
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(tabSeg[i].p1.x,tabSeg[i].p1.y);
            ctx.lineTo(tabSeg[i].p2.x,tabSeg[i].p2.y);
            ctx.strokeStyle= this.couleur; //Nuance de bleu
            ctx.lineWidth= 3;
            ctx.stroke();
        }
        else{
            ctx.lineTo(tabSeg[i].p2.x,tabSeg[i].p2.y);
            ctx.strokeStyle= this.couleur; //Nuance de bleu
            ctx.lineWidth= 3;
            ctx.stroke();
        }
    }

};

Model.prototype.construireListe = function(tabSeg,tabPoints){
    // Méthode qui construit la liste en fonction des points actuels
    if(tabPoints[1] != undefined){
        seg = new Segment(tabPoints[0], tabPoints[1]);
        tabSeg.push(seg);
    }
};

Model.prototype.retour = function(nb){
    // Méthode qui supprime le dernier segment
    if(nb == 1){
        if(this.l1.length>0){
            this.points1[1] = this.l1[this.l1.length-1].p1;
            this.l1.pop();
            }
        else{
            alert("Pas de tracé à effacer dans le 1er canvas.");
        }
    }
    else{
        if(this.l2.length>0){
            this.points2[1] = this.l2[this.l2.length-1].p1;
            this.l2.pop();
        }
        else{
            alert("Pas de tracé à effacer dans le 2ème canvas.");
        }

    }
    this.repaint(nb);
};

Model.prototype.effacer = function(nb){
    // Méthode qui efface le canvas souhaité
    if (nb == 1){
        this.l1=[];
        this.lp1=[];
    }
    else{
        this.l2=[];
        this.lp2=[];
    }
    this.repaint(nb);
};

Model.prototype.mirroirV = function(nb){
    //Méthode qui effectue une symétrie verticale
    if(nb == 1){
        var tmp = this.l1;
        this.l1=[]
        this.l1=tmp.map(elt => elt.verticalSymmetry(150));
   }
   else{
        var tmp = this.l2;
        this.l2=[]
        this.l2=tmp.map(elt => elt.verticalSymmetry(150));
   }
    this.repaint(nb);
};

Model.prototype.mirroirH = function(nb){
    // Méthode qui effectue une symétrie horizontale
    if(nb == 1){
        var tmp = this.l1;
        this.l1=[]
        this.l1=tmp.map(elt => elt.horizontalSymmetry(200));
   }
   else{
        var tmp = this.l2;
        this.l2=[]
        this.l2=tmp.map(elt => elt.horizontalSymmetry(200));
   }
    this.repaint(nb);
};

Model.prototype.echanger = function(){
    //Méthode qui permet d'échanger les deux dessins entre eux
    let tmp=this.l1;
    this.l1=this.l2;
    this.l2=tmp;
    let tmp2 =this.points1[1];
    if(this.points2[0] != undefined){
        this.points1[1] = this.points2[1];
    }
    if(this.points1[0] != undefined){
        this.points2[1]=tmp2;
    }
    this.repaint(1);
    this.repaint(2);
};

Model.prototype.exporter = function(nb){
    //Méthode qui permet d'exporter un code JSON
    if(nb == 1 && exportBool1){
        if(this.l2.length != 0){
            let msg = "[";
            this.l2.forEach(function(elt){
                msg += "[["+String(elt.p1.x)+","+String(elt.p1.y)+"],["+String(elt.p2.x)+","+String(elt.p2.y)+"]],";

            });
            msg = msg.slice(0, -1);
            msg+="]";
            jsonCode.value = msg;
            exportBool1=false;
        }
        else{
            jsonCode.value = "Code JSON...";
        }
    }
    else if(nb == 2 && exportBool2){
        if(this.l1.length != 0){
            let msg = "[";
            this.l1.forEach(function(elt){
                msg += "[["+String(elt.p1.x)+","+String(elt.p1.y)+"],["+String(elt.p2.x)+","+String(elt.p2.y)+"]],";
            });
            msg = msg.slice(0, -1);
            msg+="]";
            jsonCode2.value = msg;
            exportBool2=false;
        }
        else{
            jsonCode2.value = "Code JSON...";
        }
    }

};

Model.prototype.importer = function(nb){
    // Méthode qui permet d'importer un code JSON
    const regex = /^\[(\[\[[0-9]+,[0-9]+\],\[[0-9]+,[0-9]+\]\],{0,1})+\]$/;
    // ^\[(\[\[[0-9]+,{1}+[0-9]+\],{1}\[[0-9]+,{1}[0-9]+\]\],{1})+(\[\[[0-9]+,{1}[0-9]+\],{1}\[[0-9]+,{1}[0-9]+\]\])\]$
    if(nb == 1){
        if(jsonCode.value.lenght != 0 && regex.test(jsonCode.value)){
            let tableau = JSON.parse(jsonCode.value);
            let tmp = [];
            tableau.forEach(function(elt){
                tmp.push(new Segment(new Point(elt[0][0],elt[0][1]), new Point(elt[1][0], elt[1][1])));
            })
            this.l1 = tmp;
            this.points1[1] = tmp[tmp.length-1].p2;
            this.repaint(nb);
        }
        else{
            alert("Votre code JSON n'est pas valide.");
        }
    }
    else{
        if(jsonCode2.value.lenght != 0 && regex.test(jsonCode2.value)){
            let tableau = JSON.parse(jsonCode2.value);
            let tmp = [];
            tableau.forEach(function(elt){
                tmp.push(new Segment(new Point(elt[0][0],elt[0][1]), new Point(elt[1][0], elt[1][1])));
            })
            this.l2 = tmp;
            this.points2[1] = tmp[tmp.length-1].p2;
            this.repaint(nb);
        }
        else{
            alert("Votre code JSON n'est pas valide.");
        }
    }
};


Model.prototype.algo = function(nb,alpha){
    // Méthode qui fait l'animation du morphisme pour chaque alpha
    if(this.l1.length == 0 || this.l2.length == 0){
        return;
    }
    let moyenneTab=[];
    moyenneTab=this.moyenne(nb,alpha/10);
    if(nb == 1){
        exportBool1=true;
        this.tmpl1=moyenneTab;
        this.repaint(3);
        if(alpha <= 10){
            setTimeout(this.algo.bind(this,nb,alpha+1),this.speed);
        }

    }
    else{
        exportBool2=true;
        this.tmpl2=moyenneTab;
        this.repaint(4);
        if(alpha <= 10){
            setTimeout(this.algo.bind(this,nb,alpha+1),this.speed);
        }
    }


};

Model.prototype.moyenne = function(nb,alpha){
    //Méthode qui calcule et renvoie la moyenne de chaque segment en fonction de alpha
    if(nb == 1){
        if(alpha*10<10){
            let moyenneTab = []
            if(this.tmpl1.length>=this.tmpl2.length){
                for(var i=0; i < this.tmpl1.length; i++){
                    if(i < this.tmpl2.length){
                       moyenneTab.push(this.tmpl1[i].average(this.tmpl2[i],alpha));
                    }
                    else{
                           moyenneTab.push(this.tmpl1[i].average(moyenneTab[moyenneTab.length-1],alpha));
                    }
                }
                this.points1[1] = this.l1[this.l1.length-1].p2;
                return moyenneTab;
            }
            else{
                for(var i=0; i < this.tmpl2.length-this.tmpl1.length; i++){
                    seg = new Segment(new Point(1,2), new Point(45,21));
                    this.tmpl1.push(seg);
                }
                for(var i = 0; i < this.tmpl1.length;i++){
                    moyenneTab.push(this.tmpl1[i].average(this.tmpl2[i],alpha));
                }
                this.points1[1] = this.l2[this.l2.length-1].p2;
                return moyenneTab;
            }
        }
        else{
            moyenneTab = this.l2;
            this.points1[1] = this.l1[this.l1.length-1].p2;
            return moyenneTab;
        }
    }
    else{
        if(alpha*10<10){
            let moyenneTab = []
            if(this.tmpl2.length>=this.tmpl1.length){
                for(var i=0; i < this.tmpl2.length; i++){
                    if(i < this.tmpl1.length){
                        moyenneTab.push(this.tmpl2[i].average(this.tmpl1[i],alpha));
                    }
                    else{
                        if(alpha*10 < 10){
                            moyenneTab.push(this.tmpl2[i].average(moyenneTab[moyenneTab.length-1],alpha));
                        }
                    }
                }
                this.points2[1] = this.l2[this.l2.length-1].p2;
                return moyenneTab;
            }
            else{
                for(var i=0; i < this.tmpl1.length-this.tmpl2.length; i++){
                    seg = new Segment(new Point(1,2), new Point(45,21));
                    this.tmpl2.push(seg);
                }
                for(var i = 0; i < this.tmpl2.length;i++){
                    moyenneTab.push(this.tmpl2[i].average(this.tmpl1[i],alpha));
                }
                this.points2[1] =this.l1[this.l1.length-1].p2;
                return moyenneTab;
            }

        }
        else{
            moyenneTab = this.l1;
            this.points2[1] = this.l2[this.l2.length-1].p2;
            return moyenneTab;
        }
    }
};

Model.prototype.changerCouleur = function(couleur){
    this.couleur = couleur;
    this.repaint(1);
    this.repaint(2);


};

//Partie traitement

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var canvas2 = document.getElementById("canvas2");
var ctx2 = canvas2.getContext("2d");

var canvas3 = document.getElementById("canvas3");
var ctx3 = canvas3.getContext("2d");

var canvas4 = document.getElementById("canvas4");
var ctx4 = canvas4.getContext("2d");


var nouveauSegmentBool = false;

function calculCoordCtx(event, nb) {
    // Fonction qui recupère la position du clic et gère le traitement des points
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    x = Math.round(x);
    y = Math.round(y);
    if(nb == 1){
        if(modele.l1.length == 0 && modele.points1[1] != undefined){
            modele.points1[0] = undefined;
            modele.points1[1] = undefined;
        }
        if(modele.points1[1] == undefined && modele.points1[0] != undefined){
            modele.points1[1] = modele.points1[0];
        }
        if(modele.points1[0] == undefined && modele.points1[1] == undefined){
            modele.points1[0] = new Point(x,y);
        }
        else{
            modele.points1[0] = modele.points1[1];
            modele.points1[1] = new Point(x,y);
        }
        if(nouveauSegmentBool){
            modele.points1[0] = modele.points1[1];
            nouveauSegmentBool=false;
        }
        else{
            modele.construireListe(modele.l1, modele.points1);
        }
    }
    else{

        if(modele.l2.length == 0 && modele.points2[1] != undefined){
            modele.points2[0] = undefined;
            modele.points2[1] = undefined;
        }
        if(modele.points2[1] == undefined && modele.points2[0] != undefined){
            modele.points2[1] = modele.points2[0];
        }
        if(modele.points2[0] == undefined && modele.points2[1] == undefined){
            modele.points2[0] = new Point(x,y);
        }
        else{
            modele.points2[0] = modele.points2[1];
            modele.points2[1] = new Point(x,y);
        }
        if(nouveauSegmentBool){
            modele.points2[0] = modele.points2[1];
            nouveauSegmentBool=false;
        }
        else{
            modele.construireListe(modele.l2, modele.points2);
        }

    }
    modele.repaint(nb);

}

// evts à gérer
canvas.addEventListener("click", function(evt){
    calculCoordCtx(evt, 1);
});
canvas2.addEventListener("click", function(evt){
    calculCoordCtx(evt, 2);
});

canvas.addEventListener("click", nouveauSegment);
canvas2.addEventListener("click", nouveauSegment);

function nouveauSegment(e){
    if(e.shiftKey){
        nouveauSegmentBool = true;
    }
}

function nouveauSegmentBtn(){
    nouveauSegmentBool=true;
}

function showSpeed(){
    speed.nextSibling.nextSibling.textContent = speed.value;
    modele.setSpeed=speed.value;
}