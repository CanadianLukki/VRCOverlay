const OVRL_PFP = document.getElementById('avatar-pfp');
const OVRL_NAME = document.getElementById('avatar-name');
const OVRL_RATING = document.getElementById('avatar-rating');
const OVRL_AUTHOR = document.getElementById('avatar-author');

async function updateAviOverlay() {
    const response = await fetch('/currentAvatarData');
    const data = await response.json();

    OVRL_NAME.textContent = data.avatarName;
    OVRL_AUTHOR.textContent = `By ${data.avatarAuthor}`;
    OVRL_RATING.textContent = data.avatarRating;
    OVRL_PFP.src = data.avatarImgUrl;

    switch(OVRL_RATING.textContent){
        case 'Excellent':
            OVRL_RATING.className = 'tag avi-excellent';
            break;
        case 'Good':
            OVRL_RATING.className ='tag avi-good';
            break;
        case 'Medium':
            OVRL_RATING.className = 'tag avi-medium';
            break;
        case 'Poor':
            OVRL_RATING.className = 'tag avi-poor';
            break;
        case 'VeryPoor':
            OVRL_RATING.className = 'tag avi-reallyPoor';
            break;
    }
     
}

updateAviOverlay();
setInterval(updateAviOverlay, 1000);