import { VRChat } from "vrchat";
import { setTimeout } from 'node:timers/promises';
import promptSync from 'prompt-sync';
const prompt = promptSync();
const vrchat = new VRChat({
  application: {
    name: "AviOverlay",
    version: "0.1",
    contact: "redirect@lukkiserver.com"
  },
  authentication: {
    credentials: {
      username: "###############",
      password: "########"
    },
  },
});
const API_CONFIG = await vrchat.getConfig();
const API_CONFIG_RESPONSE = API_CONFIG.response



// Program execution
console.log(`Received awnser from the VRChat API: ${API_CONFIG_RESPONSE.status} - ${API_CONFIG_RESPONSE.statusText}`);
await setTimeout(2000);
const API_USER = await vrchat.getCurrentUser();

if(API_USER.data && 'requiresTwoFactorAuth' in API_USER.data){
  console.log("Needs authentification!");
  if(API_USER.data.requiresTwoFactorAuth?.includes('emailOtp')){
    let emailOtpInput: string = prompt('Enter the 6-digits code sent to your email: ');
    let API_USER_EMAILOTP = await vrchat.verify2FaEmailCode({body: {code: emailOtpInput}})
  } else if (API_USER.data.requiresTwoFactorAuth?.includes('totp')){
    let totpInput: string = prompt('Enter the 6-digits code on your authentificator app: ');
    let API_USER_TOTP = await vrchat.verify2Fa({body: {code: totpInput}});
  }
}

const API_USER_DATA = await vrchat.getCurrentUser();
console.log(API_USER_DATA.data)