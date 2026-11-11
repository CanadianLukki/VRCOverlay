import { VRChat } from "vrchat";
import { KeyvFile } from "keyv-file";
import { setTimeout } from 'node:timers/promises';
import { createRequire } from 'node:module';
import promptSync from 'prompt-sync';
import express from 'express';
import { unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const prompt = promptSync();
const web = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const config = require(path.join(process.cwd(), 'config.json'));
const creds = new KeyvFile({
    filename: `${process.cwd()}/credentials.json`
});
let currentAvatarData = {
    avatarName: "Loading...",
    avatarAuthor: "Loading...",
    avatarRating: "Loading...",
    showArtworkAvatar: true,
    avatarImgUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.QU1p_P68Rtu39zJg0TXDKgHaFj%3Fpid%3DApi&f=1&ipt=10d1045ca09161cd432b3c20ef277c1ebc443c1f5f548bf0bf6cbeeb39df2da1&ipo=images",
    showAuthorOnPrivate: true,
    releaseStatus: ""
};
let currentWorldData = {
    worldName: "Loading...",
    worldAuthor: "Loading...",
    worldAndroid: "false",
    worldWindows: "false",
    worldIos: "false",
    showArtworkWorld: true,
    worldImgUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.QU1p_P68Rtu39zJg0TXDKgHaFj%3Fpid%3DApi&f=1&ipt=10d1045ca09161cd432b3c20ef277c1ebc443c1f5f548bf0bf6cbeeb39df2da1&ipo=images"
};
async function authVRChat() {
    let vrchat = new VRChat({
        application: {
            name: "VRCOverlay",
            version: "0.1",
            contact: "redirect@lukkiserver.com"
        },
        keyv: creds
    });
    let currentUser = await vrchat.getCurrentUser({});
    console.log(currentUser);
    console.clear();
    if (!currentUser.data || !('id' in currentUser.data)) {
        console.log('======================= VRChat Login =======================');
        let emailPrompt = prompt('Enter the email address of your VRC account: ');
        let passwordPrompt = prompt('Enter the password of your VRC account: ', { echo: '*' });
        vrchat = new VRChat({
            application: {
                name: "VRCOverlay",
                version: "0.1",
                contact: "redirect@lukkiserver.com"
            },
            authentication: {
                credentials: {
                    username: emailPrompt,
                    password: passwordPrompt
                },
            },
            keyv: creds
        });
    }
    return vrchat;
}
const vrchat = await authVRChat();
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
// Initalize and send the data to the overlay, check if the credentials are good.
web.use(express.static(path.join(__dirname, 'overlay')));
web.get('/avatar', (request, response) => {
    response.sendFile(path.join(__dirname, 'overlay', 'avatar.html'));
});
web.get('/world', (request, response) => {
    response.sendFile(path.join(__dirname, 'overlay', 'world.html'));
});
web.get('/currentAvatarData', (request, response) => {
    response.json(currentAvatarData);
});
web.get('/currentWorldData', (request, response) => {
    response.json(currentWorldData);
});
web.listen(3000, () => {
    console.log('Starting web server at http://localhost:3000...');
});
// Loop to fetch data. Stop if the creds are invalid and stop the execution of requesting data.
let credsfileDeleted = false;
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
            avatarImgUrl: `${API_AVTR_INFO.data?.thumbnailImageUrl}`,
            showArtworkAvatar: config.showArtworkAvatar,
            showAuthorOnPrivate: config.showAuthorOnPrivate,
            releaseStatus: `${API_AVTR_INFO.data?.releaseStatus}`
        };
        currentWorldData = {
            worldName: `${API_WORLD_INFO.data?.name}`,
            worldAuthor: `${API_WORLD_INFO.data?.authorName}`,
            worldAndroid: `${API_WORLD_INFO.data?.unityPackages?.some(data => data.platform === 'android')}`,
            worldWindows: `${API_WORLD_INFO.data?.unityPackages?.some(data => data.platform === 'standalonewindows')}`,
            worldIos: `${API_WORLD_INFO.data?.unityPackages?.some(data => data.platform === 'ios')}`,
            showArtworkWorld: config.showArtworkWorld,
            worldImgUrl: `${API_WORLD_INFO.data?.imageUrl}`
        };
        await console.clear();
        console.log(`Logged in as: ${API_USER.data.displayName}\n`);
        console.log("============================================================");
        console.log("            Overlay Server running on port 3000");
        console.log("   Avatar Browser Source URL: http://lvh.me:3000/avatar");
        console.log("    World Browser Source URL: http://lvh.me:3000/world");
        console.log("============================================================\n");
        console.log(`Currently wearing: ${API_AVTR_INFO.data?.name} by ${API_AVTR_INFO.data?.authorName}.`);
        console.log(`Avatar rating: ${API_AVTR_INFO.data?.performance.standalonewindows}`);
        console.log(`Release status: ${API_AVTR_INFO.data?.releaseStatus}\n`);
        console.log(`Show author on private: ${config.showAuthorOnPrivate}`);
        console.log(`Show artwork for avatars: ${config.showArtworkAvatar}`);
        console.log(`Show artwork for worlds: ${config.showArtworkWorld}`);
        console.log("------------------------------------------------------\n");
        if (API_WORLD_INFO.data?.name != undefined && API_WORLD_INFO.data?.authorName != undefined) {
            console.log(`Current world is ${API_WORLD_INFO.data?.name} by ${API_WORLD_INFO.data?.authorName}.`);
            console.log("Platforms:");
            console.log(` PC: ${API_WORLD_INFO.data?.unityPackages?.some(data => data.platform === 'standalonewindows')}`);
            console.log(` Android: ${API_WORLD_INFO.data?.unityPackages?.some(data => data.platform === 'android')}`);
            console.log(` IOS: ${API_WORLD_INFO.data?.unityPackages?.some(data => data.platform === 'ios')}`);
        }
        else {
            console.log(`Not in a world right now.`);
        }
    }
    else {
        console.clear();
        console.error(`Could not retrive user data with given credentials. Please restart the program and try again.`);
        if (credsfileDeleted === false) {
            await unlink(`${process.cwd()}/credentials.json`);
            credsfileDeleted = true;
        }
    }
    await setTimeout(10000);
}
//# sourceMappingURL=main.js.map