// This file loads the starter animations, SFX, UI and renders the main game

const readyParent = document.querySelector('.readyParent');
const btn = document.querySelector('.readyBTN');
const chooseYourTool = document.createElement('span');

const ToolSection = document.createElement('section');
const rockIMG = document.createElement('img');
const paperIMG = document.createElement('img');
const scissorsIMG = document.createElement('img');

const opp = document.querySelector('.Opponents');

const gameJS = document.createElement('script');


// SFX

const rockSFX = new Audio('./assets/sound/Stone Slide.mp3');
const paperSFX = new Audio('./assets/sound/paperSFX.wav');
const scissorsSFX = new Audio('./assets/sound/KnifeSFX.mp3');

const yaySFX = new Audio('./assets/sound/yay.mp3');
const splatSFX = new Audio('./assets/sound/splat.mp3');
const rightSFX = new Audio('./assets/sound/rightSFX.mp3');
const wrongSFX = new Audio('./assets/sound/wrongSFX.mp3');
const failSFX = new Audio('./assets/sound/fail.mp3');
const pop2 = new Audio('./assets/sound/pop2.mp3');
const popSFX = new Audio('./assets/sound/pop.mp3');

rockIMG.addEventListener('mouseover', () => {
    rockSFX.play();
});

rockIMG.addEventListener('click', () => {
    pop2.play();
});

paperIMG.addEventListener('mouseover', () => {
    paperSFX.play();
});

paperIMG.addEventListener('click', () => {
    pop2.play();
});

scissorsIMG.addEventListener('mouseover', () => {
    scissorsSFX.play();
});

scissorsIMG.addEventListener('click', () => {
    pop2.play();
});







// Ready Button: Activate Main game

btn.addEventListener('click', () => {
    popSFX.play();
    btn.classList.add('shrink');

    // Header
    opp.classList.add('ScaleUp');


    // - Tools -
    ToolSection.classList.add('toolsParent');
    ToolSection.classList.add('animateTool');

    document.querySelector('main').appendChild(ToolSection);
    ToolSection.appendChild(rockIMG);
    ToolSection.appendChild(paperIMG);
    ToolSection.appendChild(scissorsIMG);

    rockIMG.src = 'assets/icons/rock.png';
    paperIMG.src = 'assets/icons/paper.png';
    scissorsIMG.src = 'assets/icons/scissors.png';

    rockIMG.id = 'rock';
    paperIMG.id = 'paper';
    scissorsIMG.id = 'scissors';

    rockIMG.classList.add('tools');
    paperIMG.classList.add('tools');
    scissorsIMG.classList.add('tools');

    rockIMG.classList.add('animateTool');
    paperIMG.classList.add('animateTool');
    scissorsIMG.classList.add('animateTool');
    

    setTimeout(() => {
        ToolSection.classList.add('scaleSection');

        setTimeout(() => {
            rockIMG.classList.add('normalAxis');
        }, 500);

        setTimeout(() => {
            paperIMG.classList.add('normalAxis');
        }, 900);

        setTimeout(() => {
            scissorsIMG.classList.add('normalAxis');
        }, 1200);

        setTimeout(() => {
            ToolSection.classList.add('addOverflow');
            rockIMG.classList.remove('animateTool');
            paperIMG.classList.remove('animateTool');
            scissorsIMG.classList.remove('animateTool');
            
        }, 2800);

    }, 800);
    

    


    // Needs to wait so it can show the animation
    setTimeout(() => {
        chooseYourTool.classList.add('mainText');
        chooseYourTool.textContent = "Choose Your Tool!";

        setTimeout(() => {
            chooseYourTool.classList.add('pop');
        }, 400);

        readyParent.removeChild(btn);
        readyParent.appendChild(chooseYourTool);
    }, 800);




    //Game Import
    gameJS.src = "code/game.js";
    document.body.appendChild(gameJS);

    music.play();


});