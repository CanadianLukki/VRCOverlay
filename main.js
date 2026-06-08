import { VRChat } from "vrchat";
import { setTimeout } from 'node:timers/promises';
import promptSync from 'prompt-sync';
import express from 'express';
const prompt = promptSync();
const web = express();
let currentAvatarData = {
    avatarName: "Loading...",
    avatarAuthor: "Loading...",
    avatarRating: "Loading...",
    avatarImgUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.QU1p_P68Rtu39zJg0TXDKgHaFj%3Fpid%3DApi&f=1&ipt=10d1045ca09161cd432b3c20ef277c1ebc443c1f5f548bf0bf6cbeeb39df2da1&ipo=images"
};
// I'll work on it soon I think...
const VRC_WORLD_REGEX = /Joining (wrld_.{36})/g;
const VRC_AVATAR_REGEX = /Loading Avatar Data:(avtr_.{36})/g;
let emailPrompt = prompt('Enter the email of the account: ');
let passwordPrompt = prompt('Enter the password of the account: ');
const vrchat = new VRChat({
    application: {
        name: "VRCOverlay",
        version: "0.1",
        contact: "redirect@lukkiserver.com"
    },
    authentication: {
        credentials: {
            username: "emailPrompt",
            password: "passwordPrompt"
        },
    },
});
const API_CONFIG = await vrchat.getConfig();
const API_CONFIG_RESPONSE = API_CONFIG.response;
// Program execution
console.log(`Received awnser from the VRChat API: ${API_CONFIG_RESPONSE.status} - ${API_CONFIG_RESPONSE.statusText}`);
await setTimeout(1000);
let API_USER = await vrchat.getCurrentUser({});
// TwoFactorAuth if needed
if (API_USER.data && 'requiresTwoFactorAuth' in API_USER.data) {
    console.log("Needs authentification!");
    if (API_USER.data.requiresTwoFactorAuth?.includes('emailOtp')) {
        let emailOtpInput = prompt('Enter the 6-digits code sent to your email: ');
        let API_USER_EMAILOTP = await vrchat.verify2FaEmailCode({ body: { code: emailOtpInput } });
    }
    else if (API_USER.data.requiresTwoFactorAuth?.includes('totp')) {
        let totpInput = prompt('Enter the 6-digits code on your authentificator app: ');
        let API_USER_TOTP = await vrchat.verify2Fa({ body: { code: totpInput } });
    }
}
// Initalize and send the data to the overlay
web.use(express.static(`${process.cwd()}/overlay`));
web.get('/', (request, response) => {
    response.sendFile(`${process.cwd()}/overlay/page.html`);
});
web.get('/currentAvatarData', (request, response) => {
    response.json(currentAvatarData);
});
web.listen(3000, () => {
    console.log('The web server is currenlty running at http://localhost:3000');
});
// Loop to fetch data
while (true) {
    API_USER = await vrchat.getCurrentUser({});
    if (API_USER.data && 'id' in API_USER.data) {
        const API_AVTR_ID = API_USER.data.currentAvatar;
        const API_AVTR_INFO = await vrchat.getAvatar({ path: { avatarId: API_AVTR_ID } });
        const API_WORLD_ID = API_USER.data.presence?.world || 'None';
        const API_WORLD_INFO = await vrchat.getWorld({ path: { worldId: API_WORLD_ID } });
        currentAvatarData = {
            avatarName: `${API_AVTR_INFO.data?.name}`,
            avatarAuthor: `${API_AVTR_INFO.data?.authorName}`,
            avatarRating: `${API_AVTR_INFO.data?.performance.standalonewindows}`,
            avatarImgUrl: `${API_AVTR_INFO.data?.thumbnailImageUrl}`
        };
        console.log(`Currently wearing ${API_AVTR_INFO.data?.name} by ${API_AVTR_INFO.data?.authorName}.`);
        console.log(`Avatar rating: ${API_AVTR_INFO.data?.performance.standalonewindows}`);
        console.log(`Avatar thumbnail link: ${API_AVTR_INFO.data?.thumbnailImageUrl}`);
        if (API_WORLD_INFO.data?.name != undefined && API_WORLD_INFO.data?.authorName != undefined) {
            console.log(`Current world is ${API_WORLD_INFO.data?.name} by ${API_WORLD_INFO.data?.authorName}.`);
        }
    }
    else {
        console.log(`Could not retrive user data.`);
    }
    await setTimeout(10000);
}
