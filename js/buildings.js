const buildingCol=['#0000AA','#00AA00','#00AAAA','#AA0000','#AA0000','#AA00AA','#AA5500','#FFFF55',
                   '#AAAAAA','#555555','#5555FF','#55FF55','#55FFFF','#FF5555','#FF55FF','#FFFFFF'];
/* 00.loBlack =#000000 ; 01.lowBlue =#0000AA ; 02.lowGren =#00AA00 ;
   03.lowCyan =#00AAAA ; 04.low_Red =#AA0000 ; 05.lowMagt =#AA00AA ;
   06.lowYell =#AA5500 ; 07.lowGrey =#AAAAAA ; 08.higGrey =#555555 ;
   09.higBlue =#5555FF ; 10.higGren =#55FF55 ; 11.higCyan =#55FFFF ;
   12.hig_Red =#FF5555 ; 13.higMagt =#FF55FF ; 14.higYell =#FFFF55 ;*/


function initBuildings(level,buildings){       //création aléatoire des buildings (hauteur et couleur)
    let numberOfBld = 6+2*level;
    let widthOfBld = (99/(numberOfBld));
    for (let i=0; i<numberOfBld; i++){
        let colorIndex=Math.floor(Math.random()*15);
        let buildingHeight=50+level*5+Math.floor(Math.random()*200);        //modifier pour level####
        buildings[i]={'bdleft':i*widthOfBld,'bdHeight':buildingHeight,'bdCol':buildingCol[colorIndex]}
    }
    drawBuildings(buildings,widthOfBld);
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
        if (document.getElementById(`bd_${i}`)==undefined){
            let divBldg =document.createElement('div');
            divBldg.setAttribute('class','building');
            divBldg.setAttribute('id',`bd_${i}`);
            divBldg.setAttribute('style',"");
            DOMFenetre.appendChild(divBldg);}
        let divBldgIndex=document.getElementById(`bd_${i}`);
        divBldgIndex.removeAttribute('style');
        if (buildings[i].bdHeight>0){
            divBldgIndex.style.height=`${buildings[i].bdHeight}px`;
            divBldgIndex.innerText=(i+1).toString();}
        divBldgIndex.style.left=`${i*widthOfBld}%`;
        divBldgIndex.style.width=`${widthOfBld}%`;
        divBldgIndex.style.backgroundColor=buildings[i].bdCol;
        divBldgIndex.style.backgroundImage=`url(img/windows.png)`;
    }
}

function explodeBuilding(bdIndex){        //destruction building par la bombe (hauteur réduite)
    if (bdIndex==findHighest(buildings)){score+=25;}
    else{score +=10;}
    buildings[bdIndex].bdHeight-=Math.floor(300*cheatOn+(55-.3*level));   //#####cheat mode : rase tout #####
    if (buildings[bdIndex].bdHeight<=0){
        buildings[bdIndex].bdHeight=0;
        document.getElementById(`bd_${bdIndex}`).style.border='none';}
    kaboom(bdIndex);
    if (hiScore<=score){hiScore=score}
    DOMBomb.innerHTML="";               //suppression de la bombe
}

function kaboom(myIndex){               //effet de destruction building par la bombe
    let theBuilding=document.getElementById(`bd_${myIndex}`);
    theBuilding.classList.add('aimAlert');
    theBuilding.style.height=`${buildings[myIndex].bdHeight}px`;
    DOMBomb.innerHTML="";
    bombAltitude=550;
    setTimeout(function(){theBuilding.classList.remove('aimAlert')},1210);
}