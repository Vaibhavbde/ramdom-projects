// This file contains the main game functionality



function playAgain() {
    document.querySelector('.mainText.pop').removeAttribute('style');
    readyParent.innerHTML = "";

    chooseYourTool.innerText = "Choose Your Tool!";
    readyParent.appendChild(chooseYourTool);
    ToolSection.classList.add('addOverflow');

    toolBubble.classList.remove('ScaleUp');
    toolBubbleOpp.classList.remove('ScaleUp');

    hp = 3;
    hpOpp = 3;
    hp1.classList.remove('dScale');
    hp2.classList.remove('dScale');
    hp3.classList.remove('dScale');
    hpOpp1.classList.remove('dScale');
    hpOpp2.classList.remove('dScale');
    hpOpp3.classList.remove('dScale');

    document.querySelector('.clickedTool').classList.remove('clickedTool');
}





const loseTXT = ["Ouch!", "Yikes.", "Oops..."];
const winTXT = ["Nice!", "Wowww!!", "Good one!"]; 
const animatedWords = document.createElement('div');

function textAnimation(state) {
    const rndIndex = Math.floor(Math.random() * 3);

    readyParent.removeChild(chooseYourTool);
    readyParent.appendChild(animatedWords);

    animatedWords.style.display = "flex";
    animatedWords.style.margin = "0 auto";

    if(state) {
        for(let i = 0; i < winTXT[rndIndex].length; i++) { 
            const iLetters = document.createElement('span');

            iLetters.innerText = winTXT[rndIndex][i];

            iLetters.classList.add('mainText');

            setTimeout(() => {
                iLetters.classList.add('pop');
            }, 500);

            setTimeout(() => {
                iLetters.classList.add('right-answerTXT');
            }, 550);

            animatedWords.appendChild(iLetters);

        }
    }
    else {
        for(let i = 0; i < loseTXT[rndIndex].length; i++) { 
            const iLetters = document.createElement('span');

            iLetters.innerText = loseTXT[rndIndex][i];

            iLetters.classList.add('mainText');

            setTimeout(() => {
                iLetters.classList.add('pop');
            }, 500);

            setTimeout(() => {
                iLetters.classList.add('wrong-answerTXT');
            }, 550);

            animatedWords.appendChild(iLetters);

        }
    }
}




let hp = 3;
const hp1 = document.getElementById('firstHP');
const hp2 = document.getElementById('secondHP');
const hp3 = document.getElementById('thirdHP');

let hpOpp = 3;
const hpOpp1 = document.getElementById('firstHP-opp');
const hpOpp2 = document.getElementById('secondHP-opp');
const hpOpp3 = document.getElementById('thirdHP-opp');

const finalMatchDisplay = document.createElement('span');




function replayButton() {
    const replayBTN = document.createElement('button');
    replayBTN.textContent = "Play Again";
    replayBTN.style =
    `
    margin: 0 auto;
    background-color: #49A3D6;
    border: transparent;
    border-radius: 12px;
    color: white;
    width: 106px; height: 45px;
    font-family: 'Itim';
    cursor: pointer;
    transition: transform 0.5s ease-in-out;
    `;

    setTimeout(() => {
        replayBTN.classList.add('uScale');
    }, 500);

    setTimeout(() => {
        readyParent.appendChild(replayBTN);
    }, 1000);

    replayBTN.addEventListener('click', () => {
        popSFX.play();
        playAgain();
    });
}


const confetti_script = document.createElement('script');

function matchResult(result) {
    if(result) {
        hpOpp -= 1;

        // Player Wins
        if(hpOpp <= 0) {
            hpOpp1.classList.add('dScale');

            finalMatchDisplay.classList.add('mainText');
            setTimeout(() => {
                finalMatchDisplay.classList.add('pop');
                yaySFX.play();
            },800);

            finalMatchDisplay.innerText = "You Won!! 🥳 🎉";

            readyParent.innerHTML = "";
            readyParent.appendChild(finalMatchDisplay);
            replayButton();

            confetti_script.src = "code/confetti.js";
            document.body.appendChild(confetti_script);

            setTimeout(() => {
                document.body.removeChild(confetti_script);
                document.getElementById('confetti-canvas').remove();
            },10000);


        }
        // Bot Takes Damage
        else {
            rightSFX.play();
            textAnimation(result)
            nextRound();

            if(hpOpp == 2){
                hpOpp3.classList.add('dScale');

            }
            else if (hpOpp == 1){
                hpOpp2.classList.add('dScale');

            }
        }
    }
    else {
        hp -= 1;

        // Player Loses
        if(hp <= 0) {
            hp3.classList.add('dScale');

            finalMatchDisplay.style = "color: red!important;";
            finalMatchDisplay.classList.add('mainText');
            setTimeout(() => {
                finalMatchDisplay.classList.add('pop');
                failSFX.play();
            },800);

            finalMatchDisplay.innerText = "You Lost... 😔";

            readyParent.innerHTML = "";
            readyParent.appendChild(finalMatchDisplay);
            replayButton();

        }
        // Player Takes Damage
        else {
            wrongSFX.play();
            textAnimation(result)
            nextRound();

            if(hp == 2){
                hp1.classList.add('dScale');
            }
            else if (hp == 1){
                hp2.classList.add('dScale');

            }
        }
    }
}







const bubbleOpp = document.getElementById('bot');
const toolBubbleOpp = document.createElement('div');
const toolBubbleTXTOpp = document.createElement('span');
const botToolChoices = ["ROCK", "PAPER", "SCISSORS"];

function botTurn(){
    const rnd = Math.floor(Math.random() * 3);
    const botChoice = botToolChoices[rnd];

    toolBubbleOpp.style.marginLeft = "-15px"
    toolBubbleOpp.classList.add('tool-bubble');
    toolBubbleOpp.classList.add('opp');
    toolBubbleTXTOpp.classList.add('tool-bubbleTXT');
    setTimeout(() => {
        toolBubbleOpp.classList.add('ScaleUp');
    }, 200);

    toolBubbleTXTOpp.innerText = botChoice;

    bubbleOpp.appendChild(toolBubbleOpp);
    bubbleOpp.appendChild(toolBubbleTXTOpp);
    toolBubbleOpp.appendChild(toolBubbleTXTOpp);

    return `${botChoice}`;
}



const tools = document.querySelectorAll('.tools');
const bubble = document.querySelector('.profile-bg');
const toolBubble = document.createElement('div');
const toolBubbleTXT = document.createElement('span');




function nextRound() {
    setTimeout(() => {
        // Remove stuff
        toolBubble.classList.remove('ScaleUp');
        toolBubbleOpp.classList.remove('ScaleUp');
        animatedWords.innerHTML = "";

        document.querySelector('.clickedTool').classList.remove('clickedTool');

        try {
            readyParent.removeChild(animatedWords);
        } catch (e) {
            console.log("You tied");
        }

        setTimeout(() => {
            bubble.removeChild(toolBubble);
            bubbleOpp.removeChild(toolBubbleOpp);
        },800);

        // Render stuff
        ToolSection.classList.add('addOverflow');
        chooseYourTool.textContent = "Choose Your Tool!";
        readyParent.appendChild(chooseYourTool);
    }, 3000);

}






// User clicks on a tool
for(let i = 0; i < tools.length; i++) {

    tools[i].addEventListener('click', () =>{
        tools[i].classList.add('clickedTool');
        toolBubble.classList.add('tool-bubble');
        toolBubbleTXT.classList.add('tool-bubbleTXT');
        setTimeout(() => {
            toolBubble.classList.add('ScaleUp');
        }, 200);

        // No more clickies on tools
        ToolSection.classList.remove('addOverflow');

        const userChoice = tools[i].id.toUpperCase();
        toolBubbleTXT.innerText = userChoice;



        bubble.appendChild(toolBubble);
        bubble.appendChild(toolBubbleTXT);
        toolBubble.appendChild(toolBubbleTXT);

        chooseYourTool.innerText = "Waiting for your opponent...";

        setTimeout(() => {
            const botChoiceFunc = botTurn();

            if(userChoice == botChoiceFunc){
                chooseYourTool.innerText = "Tie 😶";
                splatSFX.play();
                nextRound();
            }
            // User wins
            else if((userChoice == "ROCK" && botChoiceFunc == "SCISSORS") ||
                    (userChoice == "PAPER" && botChoiceFunc == "ROCK") ||
                    (userChoice == "SCISSORS" && botChoiceFunc == "PAPER")){

                matchResult(true);
            }
            // User loses
            else {
                matchResult(false);
            }
        }, 3000);
    });

}



