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
}

updateAviOverlay();
setInterval(updateAviOverlay, 1000);