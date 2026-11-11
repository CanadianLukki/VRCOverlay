const OVRL_PFP = document.getElementById('avatar-pfp');
const OVRL_PFP_CONTAINER = document.getElementById('pfp-container');
const OVRL_NAME = document.getElementById('avatar-name');
const OVRL_RATING = document.getElementById('avatar-rating');
const OVRL_AUTHOR = document.getElementById('author-name');
const OVRL_RELEASE = document.getElementById('private-tag');

async function updateAviOverlay() {
    const response = await fetch('/currentAvatarData');
    const data = await response.json();

    console.log(data);

    document.documentElement.style.setProperty(
        '--overlay-background-color',
        `rgba(${data.backgroundColor.join(', ')})`
    );
    OVRL_NAME.textContent = data.avatarName;
    OVRL_AUTHOR.textContent = `By ${data.avatarAuthor}`;
    OVRL_RATING.textContent = data.avatarRating;
    OVRL_PFP.src = data.avatarImgUrl;

    OVRL_PFP_CONTAINER.classList.remove('is-hidden');
    OVRL_AUTHOR.classList.remove('is-hidden');

    if (data.showAuthorOnPrivate === false && data.releaseStatus === 'private') {
        OVRL_AUTHOR.classList.add('is-hidden');
    } else {
        OVRL_AUTHOR.classList.remove('is-hidden');
    }

    if (data.showArtworkAvatar === false) {
        OVRL_PFP_CONTAINER.classList.add('is-hidden');
    } else {
        OVRL_PFP_CONTAINER.classList.remove('is-hidden');
    }

    if (data.releaseStatus == 'private') {
        OVRL_RELEASE.classList.remove('is-hidden');
    } else {
        OVRL_RELEASE.classList.add('is-hidden');
    }

    switch (OVRL_RATING.textContent) {
        case 'Excellent':
            OVRL_RATING.className = 'tag avi-excellent is-medium';
            break;
        case 'Good':
            OVRL_RATING.className = 'tag avi-good is-medium';
            break;
        case 'Medium':
            OVRL_RATING.className = 'tag avi-medium is-medium';
            break;
        case 'Poor':
            OVRL_RATING.className = 'tag avi-poor is-medium';
            break;
        case 'VeryPoor':
            OVRL_RATING.className = 'tag avi-reallyPoor is-medium';
            break;
    }

}

updateAviOverlay();
setInterval(updateAviOverlay, 1000);