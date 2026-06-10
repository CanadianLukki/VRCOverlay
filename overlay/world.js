const OVRL_PFP = document.getElementById('world-pfp');
const OVRL_NAME = document.getElementById('world-name');
const OVRL_PC_TAG = document.getElementById('pcTag');
const OVRL_ANDROID_TAG = document.getElementById('androidTag');
const OVRL_IOS_TAG = document.getElementById('iosTag');
const OVRL_AUTHOR = document.getElementById('world-author');

async function updateWorldOverlay(){
    const response = await fetch('/currentWorldData');
    const data = await response.json();

    OVRL_NAME.textContent = data.worldName;
    OVRL_AUTHOR.textContent = `By ${data.worldAuthor}`;
    OVRL_PFP.src = data.worldImgUrl;

    if(data.worldAndroid === "true"){
        OVRL_ANDROID_TAG.classList.remove('is-hidden');
    } else {
        OVRL_ANDROID_TAG.classList.add('is-hidden');
    }

    if(data.worldWindows === "true"){
        OVRL_PC_TAG.classList.remove('is-hidden');
    } else {
        OVRL_PC_TAG.classList.add('is-hidden');
    }

    if(data.worldIos === "true"){
        OVRL_IOS_TAG.classList.remove('is-hidden');
    } else {
        OVRL_IOS_TAG.classList.add('is-hidden');
    }
}

updateWorldOverlay();
setInterval(updateWorldOverlay, 1000);