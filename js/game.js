let level=1;
let score=0;
let hiScore=0;
let altitude=500;
let leftPos=-1;
let nbBomb=0;
let bombX=0;
let bombAltitude=550;
let planeSpeed=2;

const DOMLevel=document.getElementById('score');
const DOMScore=document.getElementById('level');
const DOMHiScore=document.getElementById('highS');
const DOMAlti=document.getElementById('alti');
const DOMAvion=document.getElementById('avion');
const DOMBomb=document.getElementById('bomb');
const DOMFenetre=document.getElementById('fenetre');


const buildingCol=['#0000AA','#00AA00','#00AAAA','#AA0000','#AA0000','#AA00AA','#AA5500','#FFFF55',
                   '#AAAAAA','#555555','#5555FF','#55FF55','#55FFFF','#FF5555','#FF55FF','#FFFFFF'];
/* 00.loBlack =#000000 ; 01.lowBlue =#0000AA ; 02.lowGren =#00AA00 ;
   03.lowCyan =#00AAAA ; 04.low_Red =#AA0000 ; 05.lowMagt =#AA00AA ;
   06.lowYell =#AA5500 ; 07.lowGrey =#AAAAAA ; 08.higGrey =#555555 ;
   09.higBlue =#5555FF ; 10.higGren =#55FF55 ; 11.higCyan =#55FFFF ;
   12.hig_Red =#FF5555 ; 13.higMagt =#FF55FF ; 14.higYell =#FFFF55 ;*/
let buildings=[];

function initBuildings(level,buildings){
    let numberOfBld = 6+3*level;
    let widthOfBld = (99/(numberOfBld));
    for (let i=0; i<numberOfBld; i++){
        let colorIndex=Math.floor(Math.random()*15);
        let buildingHeight=50+Math.floor(Math.random()*280);
        buildings[i]={'bdleft':i*widthOfBld,'bdHeight':buildingHeight,'bdCol':buildingCol[colorIndex]}
    }
    console.log(buildings);
    drawBuildings(buildings,widthOfBld);
}

function ready(){
    planeSpeed=Math.floor(2+level*.3);
    let divStartMssg=document.createElement('div');
    divStartMssg.setAttribute('class','startMessage');
    divStartMssg.innerText=`LEVEL ${level} : PRESS ANY KEY TO START`;
    DOMFenetre.appendChild(divStartMssg);
    const letsStart=document.addEventListener('keyup',ev => {
        if (ev.code === 'Space') {
            divStartMssg.innerText="";
            mainGame();}
        });
}


function drawBuildings(buildings,widthOfBld){
    for(let i=0;i<buildings.length;i++){
        let divBldg =document.createElement('div');
        divBldg.setAttribute('class','building');
        divBldg.setAttribute('id',`bd_${i}`);
        divBldg.style.height=`${buildings[i].bdHeight}px`;
        divBldg.style.left=`${i*widthOfBld}%`;
        divBldg.style.width=`${widthOfBld}%`;
        divBldg.style.backgroundColor=buildings[i].bdCol;
        divBldg.innerText=buildings[i].bdHeight;
        DOMFenetre.appendChild(divBldg);
    }
}

function dropBomb(alti,lefti){
    if (DOMBomb.innerHTML==""){
    nbBomb+=1;
    bombAltitude=alti; console.log('bomb:',bombAltitude)
    bombX=lefti;
    DOMBomb.style.bottom=`${bombAltitude}px`;
    DOMBomb.style.left=`${bombX}%`;
    DOMBomb.innerHTML="<img src='./img/torpedo.bmp' width='30px' height='auto'>";}
}

function affichScore(){
    DOMLevel.innerText="Score "+score.toString().padStart(5,0);
    DOMScore.innerText="Level "+level.toString().padStart(5,0);
    DOMHiScore.innerText="*High "+hiScore.toString().padStart(5,0);
    DOMAlti.innerText="Altitude "+(altitude*10).toString().padStart(5,0);
}

const timer = ms => new Promise(res => setTimeout(res, ms))

async function kaboom(myIndex){
    let boomcolor1='#FF0000'; let boomcolor2='#FFFFFF';
    let theBuilding=document.getElementById(`bd_${myIndex}`);
    for(let i=0;i<4;i++){
        theBuilding.style.backgroundColor=`${boomcolor1}`;
        await timer(80);
        theBuilding.style.backgroundColor=`${boomcolor2}`;
        await timer(80);
    }
    theBuilding.style.backgroundColor=`${buildings[myIndex].bdCol}`
    theBuilding.innerText=buildings[myIndex].bdHeight;
    theBuilding.style.height=`${buildings[myIndex].bdHeight}px`;

}

function explodeBuilding(bdIndex){
    buildings[bdIndex].bdHeight-=20;
    if (buildings[bdIndex].bdHeight<=0){buildings[bdIndex].bdHeight=0}
    //DOMBomb.innerText="";
    document.getElementById(`bd_${bdIndex}`).style.height=buildings[bdIndex].bdHeight;
    kaboom(bdIndex);
    DOMBomb.innerHTML="";


}

function moveBomb(bombAlti){
    let bdIndex=Math.floor(bombX/(99/(6+3*level)));
    if (bdIndex<0){bdIndex=0}
    console.log(bombAlti,bombX,bdIndex,buildings[bdIndex].bdHeight);
    if (bombAlti>buildings[bdIndex].bdHeight && DOMBomb.innerHTML!="" && bombAlti>0){
        DOMBomb.style.bottom=`${bombAlti}px`;
        DOMBomb.innerHTML="<img src='./img/torpedo.bmp' width='30px' height='auto'>";

    }
    else if (bombAlti<=buildings[bdIndex].bdHeight && DOMBomb.innerHTML!=""){
        DOMBomb.innerHTML="<img src='./img/torpedo.bmp' width='50px' height='auto'>";
        bombAltitude=550;
        explodeBuilding(bdIndex);}
}

function movePlane(alti,bombAlti){
    DOMAvion.innerHTML= "";
    DOMAvion.style.bottom=`${alti}px`;
    DOMAvion.style.left=`${leftPos}%`;
    DOMAvion.innerHTML=`<img src='./img/spritePlane.gif' width='80px' height='auto'>`;
    affichScore();
    moveBomb(bombAlti);
}

function mainGame(){
    const dropingBomb=document.addEventListener('keyup', ev => {
        if (ev.code === 'Space') {dropBomb(altitude,leftPos)}
      });
    let flight= setInterval(function() {
        movePlane(altitude,bombAltitude);
        leftPos +=planeSpeed; console.log('speed',planeSpeed);
        if (bombAltitude<550){bombAltitude-=30};
        if (leftPos>=97){leftPos=-1;altitude -=25;}
        if (altitude <0){DOMAvion.innerHTML=`<img src='./img/spritePlane.gif' height='60px' width='auto'><p>END</p>`;
           clearInterval(flight);}
        }, 300);
    
     
    
}  

initBuildings(level,buildings);
ready();