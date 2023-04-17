let level=1;
let score=0;
let hiScore=0;
let altitude=540;
let gameLoop=300;         // intervalle loop
let planeX=-1;            //position en X de l'avion
let nbBomb=0;
let bombX=0;              //position en X de la bombe
let bombAltitude=550;
let planeSpeed=2;
let buildings=[];         //array des buildings [{bdleft:int,'bdheight:int,'bdcol:'#hexa_color'}]

let dropingBomb=document.addEventListener('keyup', ev => {
    if (ev.code === 'Space') {dropBomb(altitude,planeX)}
  });

const DOMLevel=document.getElementById('score');
const DOMScore=document.getElementById('level');
const DOMHiScore=document.getElementById('highS');
const DOMAlti=document.getElementById('alti');
const DOMAvion=document.getElementById('avion');        //la div en position absolute de l'avion
const DOMBomb=document.getElementById('bomb');          //la div en position absolute de la bombe
const DOMFenetre=document.getElementById('fenetre');    //la zone de jeu


const buildingCol=['#0000AA','#00AA00','#00AAAA','#AA0000','#AA0000','#AA00AA','#AA5500','#FFFF55',
                   '#AAAAAA','#555555','#5555FF','#55FF55','#55FFFF','#FF5555','#FF55FF','#FFFFFF'];
/* 00.loBlack =#000000 ; 01.lowBlue =#0000AA ; 02.lowGren =#00AA00 ;
   03.lowCyan =#00AAAA ; 04.low_Red =#AA0000 ; 05.lowMagt =#AA00AA ;
   06.lowYell =#AA5500 ; 07.lowGrey =#AAAAAA ; 08.higGrey =#555555 ;
   09.higBlue =#5555FF ; 10.higGren =#55FF55 ; 11.higCyan =#55FFFF ;
   12.hig_Red =#FF5555 ; 13.higMagt =#FF55FF ; 14.higYell =#FFFF55 ;*/


function initBuildings(level,buildings){       //création aléatoire des buildings (hauteur et couleur)
    let numberOfBld = 6+3*level;
    let widthOfBld = (99/(numberOfBld));
    for (let i=0; i<numberOfBld; i++){
        let colorIndex=Math.floor(Math.random()*15);
        let buildingHeight=10+Math.floor(Math.random()*15);        //modifier pour level##########################
        buildings[i]={'bdleft':i*widthOfBld,'bdHeight':buildingHeight,'bdCol':buildingCol[colorIndex]}
    }
    drawBuildings(buildings,widthOfBld);
}

function ready(){                              //attente du lancement
    planeSpeed=Math.floor(4+level*.3);
    affichScore();
    if (document.getElementById('startMessage')==undefined){
       let divStartMssg=document.createElement('div');
       divStartMssg.setAttribute('id','startMessage');
       DOMFenetre.appendChild(divStartMssg);
    }
    let divStMssg=document.getElementById('startMessage');
    divStMssg.innerText=`LEVEL ${level} : PRESS ENTER TO START`;
    const letsStart=document.addEventListener('keyup',ev => {
        if (ev.code === 'Enter') {
            divStMssg.innerText="";
            mainGame();}
        });
}
function findHighest(buildings){               //récupération de l'index du building le plus haut

    let bdList=buildings.map(bd => bd.bdHeight);
    bdList=bdList.sort((function(a, b){return b - a}));
    let highIndex=buildings.findIndex(bd => bd.bdHeight == bdList[0]);
    console.log('high',highIndex);
    return highIndex;
}

function drawBuildings(buildings,widthOfBld){    //display du DOM -création de buildings
    for(let i=0;i<buildings.length;i++){
        let divBldg =document.createElement('div');
        divBldg.setAttribute('class','building');
        divBldg.setAttribute('id',`bd_${i}`);
        divBldg.style.height=`${buildings[i].bdHeight}px`;
        divBldg.style.left=`${i*widthOfBld}%`;
        divBldg.style.width=`${widthOfBld}%`;
        divBldg.style.backgroundColor=buildings[i].bdCol;
        //divBldg.style.backgroundImage=`url(../img/windows.png)`;
        divBldg.innerText=buildings[i].bdHeight;
        DOMFenetre.appendChild(divBldg);
    }
}

function dropBomb(alti,lefti){                 //lancement bombe si aucune bombe déjà en cours, selon position avion
    nbBomb+=1;
    if (DOMBomb.innerHTML=="" && nbBomb>1){
    bombAltitude=alti;
    bombX=lefti;
    DOMBomb.style.bottom=`${bombAltitude}px`;
    DOMBomb.style.left=`${bombX}%`;
    DOMBomb.innerHTML="<img src='img/torpedo.bmp' width='30px' height='auto'>";}
}

function affichScore(){
    DOMLevel.innerText="Score "+score.toString().padStart(5,0);
    DOMScore.innerText="Level "+level.toString().padStart(5,0);
    DOMHiScore.innerText="*High "+hiScore.toString().padStart(5,0);
    DOMAlti.innerText="Altitude "+(altitude*10).toString().padStart(5,0);
}

const timer = ms => new Promise(res => setTimeout(res, ms))

async function kaboom(myIndex){               //effet de destruction building par la bombe
    let boomcolor1='#FF0000'; let boomcolor2='#FFFFFF';
    let theBuilding=document.getElementById(`bd_${myIndex}`);
    for(let i=0;i<3;i++){
        theBuilding.style.backgroundColor=`${boomcolor1}`;
        await timer(70);
        theBuilding.style.backgroundColor=`${boomcolor2}`;
        await timer(70);
    }
    theBuilding.style.backgroundColor=`${buildings[myIndex].bdCol}`
    theBuilding.innerText=buildings[myIndex].bdHeight;
    theBuilding.style.height=`${buildings[myIndex].bdHeight}px`;

}

function explodeBuilding(bdIndex){        //destruction building par la bombe (hauteur réduite)
    buildings[bdIndex].bdHeight-=25;
    if (buildings[bdIndex].bdHeight<=0){buildings[bdIndex].bdHeight=0}
    //DOMBomb.innerText="";
    document.getElementById(`bd_${bdIndex}`).style.height=buildings[bdIndex].bdHeight;
    kaboom(bdIndex);
    score +=10;
    if (hiScore<=score){hiScore=score}
    DOMBomb.innerHTML="";               //suppression de la bombe
}

function moveBomb(bombAlti){            //descente de la bombe -contrôle du building dessous
    let bdIndex=Math.floor(bombX/(99/(6+3*level)));
    if (bdIndex<0){bdIndex=0}
    if (bombAlti>buildings[bdIndex].bdHeight && DOMBomb.innerHTML!="" && bombAlti>0){
        DOMBomb.style.bottom=`${bombAlti}px`;
        DOMBomb.innerHTML="<img src='img/torpedo.bmp' width='30px' height='auto'>";

    }
    else if (bombAlti<=buildings[bdIndex].bdHeight && DOMBomb.innerHTML!=""){
        DOMBomb.innerHTML="<img src='img/torpedo.bmp' width='50px' height='auto'>";
        bombAltitude=550;
        explodeBuilding(bdIndex);}
}

function movePlane(alti,bombAlti){     //affichage avion
    DOMAvion.innerHTML= "";
    DOMAvion.style.bottom=`${alti}px`;
    DOMAvion.style.left=`${planeX}%`;
    DOMAvion.innerHTML=`<img src='img/spritePlane.gif' width='80px' height='auto'>`;
    affichScore();
    moveBomb(bombAlti);
}

function crashPlane(){               //altitude avion <altitude batiment
    let crashIndex=findHighest(buildings)*(99/(6+3*level));
    console.log(crashIndex);
        
    DOMAvion.style.left=`${crashIndex}%`;
    DOMAvion.innerHTML=`<p>YOU LOST</p><img src='img/kaboom.gif' height='90px' width='auto'>`;
    console.log('crash at',altitude,findHighest(buildings));
    endGame();
}

function endGame(){                         //fin de partie, sortie de boucle################
    document.removeEventListener('keyup', ev => {
        if (ev.code === 'Space') {dropBomb(altitude,planeX)}
      });
    planeSpeed=0;
    clearInterval(gameLoop);
}
async function winRound(){                    //passage au level suivant, retour avion altitude init
    DOMAvion.innerHTML=`<img src='img/spritePlane.gif' height='60px' width='auto'><p>SAFE LANDING</p>`;
    await timer(500);
    planeX=0;
    for(let i=0;i<=98;i++){movePlane(i,550);}
    DOMAvion.innerHTML=`<img src='img/spritePlane.gif' height='60px' width='auto'><p>YOU WIN</p>`;
    endGame();
    console.log(dropingBomb);
    level+=1;
    altitude=540;
    planeX =-2;
    nbBomb =0;
    buildings=[];
    initBuildings(level,buildings);
    await timer(500);
    document.addEventListener('keyup', ev => {
        if (ev.code === 'Space') {dropBomb(altitude,planeX)}
      });
    ready();

}


function mainGame(){            //boucle principale
    
    gameLoop= setInterval(function() {
        movePlane(altitude,bombAltitude);
        planeX +=planeSpeed;
        if (bombAltitude<550){bombAltitude-=30};
        if (planeX>=98){planeX=-1;altitude -=25;}
        if(altitude+20 <buildings[findHighest(buildings)].bdHeight){
            crashPlane();
            endGame();}
        if (buildings[findHighest(buildings)].bdHeight==0){
                clearInterval(gameLoop); winRound();}
        }, 400);
}  

initBuildings(level,buildings);
ready();