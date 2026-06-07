import { VRChat } from "vrchat";
import { KeyvFile } from "keyv-file";
import { setTimeout } from 'node:timers/promises';
import promptSync from 'prompt-sync';
import { error } from "node:console";
import express from 'express';
const prompt = promptSync();
const web = express();
const VRC_WORLD_REGEX = /Joining (wrld_.{36})/g;
const VRC_AVATAR_REGEX = /Loading Avatar Data:(avtr_.{36})/g;
const OVRL_PFP = document.getElementById('avatar-pfp');
const OVRL_NAME = document.getElementById('avatar-name');
const OVRL_RATING = document.getElementById('avatar-rating');
const OVRL_AUTHOR = document.getElementById('avatar-author');

const vrchat = new VRChat({
  application: {
    name: "VRCOverlay",
    version: "0.1",
    contact: "redirect@lukkiserver.com"
  },
  keyv: new KeyvFile({ filename: "./keyvfile.json" })
});
const API_CONFIG = await vrchat.getConfig();
const API_CONFIG_RESPONSE = API_CONFIG.response


// Program execution
console.log(`Received awnser from the VRChat API: ${API_CONFIG_RESPONSE.status} - ${API_CONFIG_RESPONSE.statusText}`);
await setTimeout(1000);
let API_USER = await vrchat.getCurrentUser({});

// TwoFactorAuth if needed
if (API_USER.data && 'requiresTwoFactorAuth' in API_USER.data) {
  console.log("Needs authentification!");

  if (API_USER.data.requiresTwoFactorAuth?.includes('emailOtp')) {
    let emailOtpInput: string = prompt('Enter the 6-digits code sent to your email: ');
    let API_USER_EMAILOTP = await vrchat.verify2FaEmailCode({ body: { code: emailOtpInput } });

  } else if (API_USER.data.requiresTwoFactorAuth?.includes('totp')) {
    let totpInput: string = prompt('Enter the 6-digits code on your authentificator app: ');
    let API_USER_TOTP = await vrchat.verify2Fa({ body: { code: totpInput } });

  }
}

web.get('/', (request, response) => {
  response.sendFile(`${process.cwd()}/overlay/page.html`);
});

web.listen(3000, () => {
  console.log('The web server is currenlty running at http://localhost:3000');
});

// Loop to fetch data
while (true) {
  API_USER = await vrchat.getCurrentUser({});
  if (API_USER.data && 'id' in API_USER.data) {
    const API_AVTR_ID: string = API_USER.data.currentAvatar;
    const API_AVTR_INFO = await vrchat.getAvatar({ path: { avatarId: API_AVTR_ID } });

    const API_WORLD_ID: string = API_USER.data.presence?.world || 'None';
    const API_WORLD_INFO = await vrchat.getWorld({ path: { worldId: API_WORLD_ID } });
    
    console.log(`Currently wearing ${API_AVTR_INFO.data?.name} by ${API_AVTR_INFO.data?.authorName}.`);
    console.log(`Avatar rating: ${API_AVTR_INFO.data?.performance.standalonewindows}`)
    console.log(`Avatar thumbnail link: ${API_AVTR_INFO.data?.thumbnailImageUrl}`)

    if (API_WORLD_INFO.data?.name != undefined && API_WORLD_INFO.data?.authorName != undefined){
      console.log(`Current world is ${API_WORLD_INFO.data?.name} by ${API_WORLD_INFO.data?.authorName}.`);
    }
  }
  else {
    console.log(`Could not retrive user data.`);
  }
  await setTimeout(10000)
}