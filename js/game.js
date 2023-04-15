var level=1;
var score=0;
var hiScore=0;
var altitude=50;

const DOMLevel=document.getElementById('score');
const DOMScore=document.getElementById('level');
const DOMHiScore=document.getElementById('highS');
const DOMAvion=document.getElementById('avion');

async function delayTime(delay){
    setTimeout("",delay);
}

function movePlane(alti){
    altitude -=1;
    DOMAvion.innerHTML= "";
    DOMAvion.style.top=`${alti}px`;
    DOMAvion.innerHTML=`<img src='./img/spritePlane.gif' height='80px' width='auto'><p>${alti}</p>`;
    console.log(alti,altitude);
}

async function mainGame(){
    while (altitude>0){
    DOMLevel.innerText="Score "+score.toString().padStart(5,0);
    DOMScore.innerText="Level "+level.toString().padStart(5,0);
    DOMHiScore.innerText="*High "+hiScore.toString().padStart(5,0);
    let newAltitude=500-10*altitude;

    await delayTime(1000);
    movePlane(newAltitude);
    }
}  

mainGame();