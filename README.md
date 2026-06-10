# VRCOverlay
A small streaming overlay that shows VRChat information about current world and avatar.  
  
The tool uses the VRChat API to retreive avatar metadata and then display it on an HTML overlay that you can put on apps like OBS, Streamlabs, TikTok Live App or any other similar app that supports adding a browser source.  
  
To avoid API rate limitations, the tool fetches and check for changes every 10 seconds. There can be a delay before the UI updates.
  
### Why do you ask for my VRChat credentials?
To get profile information and current world information, you need to communicate with the VRChat API by using your VRChat credentials(email, password and totp). No private information will be sent or stored to my servers, or any external database. Your login details are strictly used to authenticate directly with the official VRChat API and will be saved at `credentials.json` in the app folder. I have no access to your account data, your security codes, or your current world or avatar.

## Disclaimer
I am not a coding expert. Not now as I am making this tool. If someone find issues and find fixes or ways to optimize the code, I would be happy if I could learn from you and improve my skills.

## Acknowledgements
VRChat API from <a href="https://vrchat.community">VRChat.community</a>.  
Web server hosted using <a href="https://vrchat.community">expressjs</a>. 
