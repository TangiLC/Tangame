var level=4;
var score=0;
var hiScore=0;
var altitude=50;
var leftPos=-1;
var bombX=0;
var bombAltitude=50;

const DOMLevel=document.getElementById('score');
const DOMScore=document.getElementById('level');
const DOMHiScore=document.getElementById('highS');
const DOMAlti=document.getElementById('alti');
const DOMAvion=document.getElementById('avion');
const DOMBomb=document.getElementById('bomb');
const DOMFenetre=document.getElementById('fenetre');
const dropingBomb=document.addEventListener('keyup', ev => {
    if (ev.code === 'Space') {dropBomb(altitude,leftPos)}
  });

const buildingCol=['#0000AA','#00AA00','#00AAAA','#AA0000','#AA0000','#AA00AA','#AA5500','#FFFF55',
                   '#AAAAAA','#555555','#5555FF','#55FF55','#55FFFF','#FF5555','#FF55FF','#FFFFFF'];
/* 00.loBlack =#000000 ; 01.lowBlue =#0000AA ; 02.lowGren =#00AA00 ;
   03.lowCyan =#00AAAA ; 04.low_Red =#AA0000 ; 05.lowMagt =#AA00AA ;
   06.lowYell =#AA5500 ; 07.lowGrey =#AAAAAA ; 08.higGrey =#555555 ;
   09.higBlue =#5555FF ; 10.higGren =#55FF55 ; 11.higCyan =#55FFFF ;
   12.hig_Red =#FF5555 ; 13.higMagt =#FF55FF ; 14.higYell =#FFFF55 ;*/
var buildings=[];

function initBuildings(level,buildings){
    let numberOfBld = 6+3*level;
    let widthOfBld = (100/(numberOfBld));
    for (let i=0; i<numberOfBld; i++){
        let colorIndex=Math.floor(Math.random()*15);
        let buildingHeight=50+Math.floor(Math.random()*280);
        buildings[i]={'bdleft':i*widthOfBld,'bdHeight':buildingHeight,'bdCol':buildingCol[colorIndex]}
    }
    console.log(buildings);
    drawBuildings(buildings,widthOfBld);
}

function drawBuildings(buildings,widthOfBld){
    for(let i=0;i<buildings.length;i++){
        let divBldg =document.createElement('div');
        divBldg.setAttribute('class','building');
        divBldg.style.height=`${buildings[i].bdHeight}px`;
        divBldg.style.left=`${i*widthOfBld}%`;
        divBldg.style.width=`${widthOfBld}%`;
        divBldg.style.backgroundColor=buildings[i].bdCol;
        divBldg.innerText=buildings[i].bdHeight;
        DOMFenetre.appendChild(divBldg);
    }
}

function dropBomb(alti,lefti){
    if (DOMBomb.innerText==""){
    bombAltitude=520-10*alti; console.log(500-10*altitude,bombAltitude);
    bombX=lefti;
    DOMBomb.style.top=`${bombAltitude}px`;
    DOMBomb.style.left=`${bombX}%`;
    DOMBomb.innerText="*";}
}

function affichScore(){
    DOMLevel.innerText="Score "+score.toString().padStart(5,0);
    DOMScore.innerText="Level "+level.toString().padStart(5,0);
    DOMHiScore.innerText="*High "+hiScore.toString().padStart(5,0);
    DOMAlti.innerText="Altitude "+(altitude*10).toString().padStart(5,0);
}
function moveBomb(bombAlti){
    
    if (bombAlti<600 && DOMBomb.innerText!=""){
        DOMBomb.style.top=`${bombAlti}px`;
    }
    else {DOMBomb.innerText=""}
}

function movePlane(alti,bombAlti){
    DOMAvion.innerHTML= "";
    DOMAvion.style.top=`${alti}px`;
    DOMAvion.style.left=`${leftPos}%`;
    DOMAvion.innerHTML=`<img src='./img/spritePlane.gif' width='80px' height='auto'>`;
    affichScore();
    moveBomb(bombAlti);
}

function mainGame(){
    let flight= setInterval(function() {
        let newAltitude=500-10*altitude;
        movePlane(newAltitude,bombAltitude);
        leftPos +=2; bombAltitude+=20;
        if (leftPos>=96){leftPos=-1;altitude -=5;}
        if (altitude <0){DOMAvion.innerHTML=`<img src='./img/spritePlane.gif' height='60px' width='auto'><p>END</p>`;
           clearInterval(flight);}
        }, 100);
    
     
    
}  

initBuildings(level,buildings);
mainGame();