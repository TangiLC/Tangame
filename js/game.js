var level=1;
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
const dropingBomb=document.addEventListener('keyup', ev => {
    if (ev.code === 'Space') {dropBomb(altitude,leftPos)}
  });

function dropBomb(alti,lefti){
    if (DOMBomb.innerText==""){
    bombAltitude=450-10*alti; console.log(500-10*altitude,bombAltitude);
    bombX=lefti+1;
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
    if (bombAlti<500 && DOMBomb.innerText!=""){
        DOMBomb.style.top=`${bombAlti}px`;
    }
    else {DOMBomb.innerText=""}
}

function movePlane(alti,bombAlti){
    DOMAvion.innerHTML= "";
    DOMAvion.style.top=`${alti}px`;
    DOMAvion.style.left=`${leftPos}%`;
    DOMAvion.innerHTML=`<img src='./img/spritePlane.gif' height='80px' width='auto'>`;
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


mainGame();