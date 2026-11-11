const OVRL_PFP = document.getElementById('world-pfp');
const OVRL_PFP_CONTAINER = document.getElementById('pfp-container');
const OVRL_NAME = document.getElementById('world-name');
const OVRL_PC_TAG = document.getElementById('pcTag');
const OVRL_ANDROID_TAG = document.getElementById('androidTag');
const OVRL_IOS_TAG = document.getElementById('iosTag');
const OVRL_AUTHOR = document.getElementById('world-author');

async function updateWorldOverlay(){
    const response = await fetch('currentWorldData');
    const data = await response.json();

    document.documentElement.style.setProperty(
        '--overlay-background-color',
        `rgba(${data.backgroundColor.join(', ')})`
    );
    OVRL_NAME.textContent = data.worldName;
    OVRL_AUTHOR.textContent = `By ${data.worldAuthor}`;
    OVRL_PFP.src = data.worldImgUrl;

    if (data.showArtworkWorld === false) {
        OVRL_PFP_CONTAINER.classList.add('is-hidden');
    } else {
        OVRL_PFP_CONTAINER.classList.remove('is-hidden');
    }

    if(OVRL_NAME.textContent == 'undefined'){
        OVRL_NAME.textContent = 'Not in a world...'
        OVRL_AUTHOR.textContent = `Loading...`;
        OVRL_PFP.src = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fapi.vrchat.cloud%2Fapi%2F1%2Ffile%2Ffile_c2b7ad18-5276-4e9b-aef7-8e18555e5030%2F7%2Ffile&f=1&nofb=1&ipt=0e5410108d29cb32e76debcc7bd3d82596ee2dc7c31844fbcbfde71871133528"
    }

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