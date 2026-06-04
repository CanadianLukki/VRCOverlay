import { VRChat } from "vrchat";
import { setTimeout } from 'node:timers/promises';
const prompt = require('prompt-sync')();
const vrchat = new VRChat({
    application: {
        name: "AviOverlay",
        version: "0.1",
        contact: "redirect@lukkiserver.com"
    },
    authentication: {
        credentials: {
            username: "contactme@lukkiserver.com",
            password: "E3eVz8fUU6X6XRBcd"
        },
    },
});
const API_CONFIG = await vrchat.getConfig();
const API_CONFIG_RESPONSE = API_CONFIG.response;
const API_USER = await vrchat.getCurrentUser();
// Program execution
console.log(`Received awnser from the VRChat API: ${API_CONFIG_RESPONSE.status} - ${API_CONFIG_RESPONSE.statusText}`);
await setTimeout(2000);
let emailCode = prompt("Email 2FA Code: ");
const response = await vrchat.verify2FaEmailCode({
    body: {
        code: emailCode
    }
});
console.log(API_USER);
