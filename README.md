# VRCOverlay
A small streaming overlay that shows VRChat information about current world and avatar. Avaliable for Windows x64 and Linux x64.
  
The tool uses the VRChat API to retreive avatar metadata and then display it on an HTML overlay that you can put on apps like OBS, Streamlabs, TikTok Live App or any other similar app that supports adding a browser source.  
  
To avoid API rate limitations, the tool fetches and check for changes every 10 seconds. There can be a delay before the UI updates.
  
### Why do you ask for my VRChat credentials?
To get profile information and current world information, you need to communicate with the VRChat API by using your VRChat credentials(email, password and totp). No private information will be sent or stored to my servers, or any external database. Your login details are strictly used to authenticate directly with the official VRChat API and a login token will be saved at `credentials.json` in the app folder. I have no access to your account data, your security codes, or your current world or avatar.  

## Using `config.json`  
The config file allows you to change settings regarding the overlay. Other settings will be added as the tool continues to grow.  
  
### `showAuthorOnPrivate`
Will show the name of the author when you wear a private avatar if set to `true`.

### `showArtworkAvatar`
Will show the artwork of avatars if set to `true`.

### `showArtworkWorld`
Will show the artwork of worlds if set to `true`. 

### `backgroundColor`
Sets the background color of the avatar and world overlay cards. Use an array in `[red, green, blue, opacity]` order. RGB values must be integers from `0` to `255`, and opacity must be from `0` to `1`.

*More to come soon...*  


## Disclaimer
I am not a coding expert. Not now as I am making this tool. If someone find issues and find fixes or ways to optimize the code, I would be happy if I could learn from you and improve my skills.

## Acknowledgements
VRChat API from <a href="https://vrchat.community">VRChat.community</a>.  
Web server hosted using <a href="https://expressjs.com/">expressjs</a>. 

#### AI disclosure
AI was used for autocompletion and finding bugs and vulnerabilities. No assets or art was generated using AI.