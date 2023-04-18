let cheatOn=0;
let newGame=1;
let level=1;
let score=0;
let hiScore=0;
let altitude=540;
let gameLoop=300;         // intervalle loop
let planeX=-1;            //position en X de l'avion
let nbBomb=-1;
let bombX=0;              //position en X de la bombe
let bombAltitude=550;
let planeSpeed=3;
let buildings=[];         //array des buildings [{bdleft:int,'bdheight:int,'bdcol:'#hexa_color'}]

const DOMLevel=document.getElementById('score');
const DOMScore=document.getElementById('level');
const DOMHiScore=document.getElementById('highS');
const DOMAlti=document.getElementById('alti');
const DOMAim=document.getElementById('aim');
const DOMAvion=document.getElementById('avion');        //la div en position absolute de l'avion
const DOMBomb=document.getElementById('bomb');          //la div en position absolute de la bombe
const DOMFenetre=document.getElementById('fenetre');    //la zone de jeu
let keyListen=document.addEventListener('keyup', ev => {
    if (ev.code === 'Space' && nbBomb!=-1) {dropBomb(altitude,planeX)}
    if (ev.code === 'Space' && nbBomb==-1 && newGame) {
        document.getElementById('startMessage').innerText="";
        mainGame();}
  });


async function ready(){                              //attente du lancement
    planeSpeed=Math.floor(3+level*.2);
    affichScore();
    if (document.getElementById('startMessage')==undefined){
       let divStartMssg=document.createElement('div');
       divStartMssg.setAttribute('id','startMessage');
       DOMFenetre.appendChild(divStartMssg);
    }
    let divStMssg=document.getElementById('startMessage');
    divStMssg.innerText=`LEVEL ${level} : PRESS <SPACE> TO START`;
    
}


function dropBomb(alti,lefti){                 //lancement bombe si aucune bombe déjà en cours, selon position avion
    nbBomb+=1;
    if (DOMBomb.innerHTML=="" && nbBomb>=1){
    bombAltitude=alti;
    bombX=lefti-.1;
    if(bombX<1){bombX=1}
    DOMBomb.style.bottom=`${bombAltitude}px`;
    DOMBomb.style.left=`${bombX}%`;
    DOMBomb.innerHTML="<img src='img/torpedo.bmp' width='15px' height='auto'>";}
}

function affichScore(){
    DOMLevel.innerText="Score "+score.toString().padStart(5,0);
    DOMScore.innerText="Level "+level.toString().padStart(5,0);
    DOMHiScore.innerText="*High "+hiScore.toString().padStart(5,0);
    DOMAlti.innerText="Altitude "+(altitude*10).toString().padStart(5,0);
    DOMAim.style.backgroundColor=buildings[findHighest(buildings)].bdCol;
    if ((altitude-2*Math.ceil(25+level*.3))<=buildings[findHighest(buildings)].bdHeight){ 
        DOMAim.classList.toggle('aimAlert');
        DOMAim.innerText="WARNING Bld n#"+(findHighest(buildings)+1).toString();
    }
    else {DOMAim.classList.remove('aimAlert');
    DOMAim.innerText="Aim Bld n#"+(findHighest(buildings)+1).toString();}

}

const timer = ms => new Promise(res => setTimeout(res, ms))


function moveBomb(bombAlti){            //descente de la bombe -contrôle du building dessous
    let bdIndex=Math.floor(bombX/(99/(6+2*level)));
    if (bdIndex<0){bdIndex=0}
    if (bombAlti>buildings[bdIndex].bdHeight && DOMBomb.innerHTML!="" && bombAlti>0){
        DOMBomb.style.bottom=`${bombAlti}px`;
        DOMBomb.innerHTML="<img src='img/torpedo.bmp' width='15px' height='auto'>";

    }
    else if (bombAlti<=buildings[bdIndex].bdHeight && DOMBomb.innerHTML!=""){
        DOMBomb.style.bottom=`${bombAlti-7}px`;
        if(bombAlti>0){DOMBomb.style.left=`${bombX-1}%`
        DOMBomb.innerHTML="<img src='img/kaboom.gif' width='90px' height='25px'>";}
        else {DOMBomb.innerHTML="";}
        bombAltitude=550;
        setTimeout(function(){explodeBuilding(bdIndex)},200);
        affichScore();}
}

function movePlane(alti,posX,bombAlti){     //affichage avion
    //DOMAvion.innerHTML= "";
    DOMAvion.style.bottom=`${alti}px`;
    DOMAvion.style.left=`${posX}%`;
    DOMAvion.innerHTML=`<img src='img/spritePlane.gif' width='80px' height='auto'>`;
    affichScore();
    moveBomb(bombAlti);
}

function crashPlane(){               //altitude avion <altitude batiment
    nbBomb=-1;
    newGame=0;
    //document.removeEventListener('keyup', {});
    let crashIndex=findHighest(buildings)*(99/(6+2*level));
    DOMAim.className ="noAlert";
    DOMAim.innerText="CRASH BLD #"+(findHighest(buildings)+1).toString();    
    DOMAvion.style.left=`${crashIndex}%`;
    DOMAvion.innerHTML=`<p>YOU LOST</p><img src='img/kaboom.gif' height='50px' width='auto'>`;
    console.log('crash at',altitude,findHighest(buildings));
    setTimeout(function(){endGame()},800);
}

async function endGame(){                         //fin de partie, sortie de boucle################
    
    planeSpeed=0;
    
    
}

function newLevel(){
    if(altitude==-1){
        newGame=1;
        planeX=-2;
        level+=1;
        altitude=550-level;
        nbBomb =-1;
        bombAltitude=550;
        buildings=[];
        DOMAvion.innerHTML="";
        DOMAim.innerText="NEXT LEVEL";
        initBuildings(level,buildings);
       /* document.addEventListener('keyup', ev => {
            if (ev.code === 'Space') {dropBomb(altitude,planeX)}
        });*/
    }
    ready();
}

async function winRound(){                    //passage au level suivant, retour avion altitude init
    //await timer(500);
    nbBomb=-1;
    newGame=0;
    DOMAim.classList.remove('aimAlert');
    DOMAim.innerText="SAFE LANDING";
    DOMBomb.innerHTML="";
    DOMAvion.style.bottom=`0px`;
    DOMAvion.innerHTML=`<p>SAFE LANDING</p><img src='img/spritePlane.gif' height='auto' width='90px'>`;
    //document.removeEventListener('keyup', ev =>{});
    
    for(let landing=0;landing<=80;landing+=5){
        DOMAvion.style.left=`${landing}%`;
        await timer(Math.ceil(50+3*landing));
    }
    setTimeout(newLevel(),3000);
    
}


function mainGame(){            //boucle principale
    nbBomb=0;
    gameLoop= setInterval(function() {
        movePlane(altitude,planeX,bombAltitude);
        planeX +=planeSpeed;
        if (bombAltitude<550){bombAltitude-=40};
        if (planeX>=98){planeX=-1;altitude -=Math.floor(25+level*.3);}
        if(altitude+10 <buildings[findHighest(buildings)].bdHeight && planeX>=findHighest(buildings)*(99/(6+2*level))){
            clearInterval(gameLoop);
            crashPlane();
            }
        if (buildings[findHighest(buildings)].bdHeight==0){
                clearInterval(gameLoop); altitude=-1; setTimeout(winRound(),200);}
        }, 300);
}  

initBuildings(level,buildings);
ready();