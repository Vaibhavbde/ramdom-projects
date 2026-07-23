
// Music Setup
const storedVolume = localStorage.getItem('musicVolume')
const defaultVolume = 0.3;

const isValidVolume = /^0(\.\d+)?|1(\.0*)?$/.test(storedVolume);
const mVolume = isValidVolume ? parseFloat(storedVolume) : defaultVolume;

const music = new Audio('./assets/sound/zeldaBgMusic.mp3');
music.loop = true;
music.volume = mVolume;



const settings = document.querySelector('.settings');
const settingsDivPopup = document.createElement('div');
let settingsDivPopup_Bool = false;

const settingItem = document.createElement('div');
const titleSpan = document.createElement('span');
const inputSliderParent = document.createElement('input');
const resultSpan = document.createElement('span');

settings.addEventListener('click', () => {

    /*If the popup is open, if it's clicked again, then close it &
     Remove it from the DOM */
    if(settingsDivPopup_Bool != false){
        document.body.removeChild(settingsDivPopup)
        settingsDivPopup_Bool = false;
        return
    }

    settingsDivPopup_Bool = true;
    settingsDivPopup.classList.add('settingPopupDiv');
    document.body.appendChild(settingsDivPopup);

    
    titleSpan.innerText = "Music";
    inputSliderParent.id = "musicSlider";
    inputSliderParent.type = "range";
    inputSliderParent.value = mVolume;
    inputSliderParent.min = "0";
    inputSliderParent.max = "1";
    inputSliderParent.step = "0.1";
    resultSpan.id = "musicVolText";

    settingItem.classList.add('settingItem');

    settingsDivPopup.appendChild(settingItem);
    settingItem.appendChild(titleSpan);
    settingItem.appendChild(inputSliderParent);
    settingItem.appendChild(resultSpan);

    const slider = document.querySelector('#musicSlider');
    const musicVolText = document.querySelector('#musicVolText');
    
    musicVolText.innerHTML = mVolume || slider.value;
    slider.addEventListener('input', (event) =>{
        const newVolume = parseFloat(event.target.value);
        musicVolText.innerHTML = newVolume;
        localStorage.setItem('musicVolume', newVolume);
        music.volume = newVolume;
    });
    
});