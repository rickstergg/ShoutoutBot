# What is this?

This is a Twitch Chatbot built on top of `tmi.js` and can be configured via the `default.json` file. Pull it locally, populate the settings with your own configuration, add in some API keys, and you got a bot that can do some serious werk for your own channels or channels you mod for!

# Features

* Shoutsout streamers and friends of the channel when they visit, along with a customizable delay duration so it's instantaneous or - on the other hand - doesn't seem robotic.
* Shoutsout streamers who raid you!
* Run a mass ban command for the follow bots that have been going around. Try to do this offline so you don't get spammed with ban messages from the bot!
* Automatically bans any account that says the legendary big follows sentence.

The following features require a Riot Games API Key:

* Responds to `!rank` commands, particularly League of Legends for now.
  * e.g. `!rank` or `!rank summoner name`
* Grabs LoL champion spell cooldowns and accepts ability haste as a parameter (no more mobafire / leaguepedia lookups)!
  * e.g. `!cd shen e 100`
  * Returns `Shen E: 9, 8, 7, 6, 5`

# How do I run this?

1. Pre-requisites and Installation
  - Install the latest LTS of Node. As of now, I'm using `10.16.3`
  - Clone the repository to any directory you like.
  - Run `npm install` in the root directory you cloned into.

2. Twitch Bot and Identity Creation
  - Create a Twitch account for your bot if you haven't already. Mine is called CypherCam.
  - Generate a token for your bot [here](https://twitchapps.com/tmi/).
  - Make sure you're logged in as the bot and not your usual Twitch account when you do this!
  - This should technically work for your own account, but not sure what the interaction is like.
  - The token starts with `oauth:` followed by an alphanumeric string.
  - Write this down, and don't show anybody else!

- Configuration: modify the `default.json` file in the config directory.
  - Replace `channels` with your own channel name or a list of channels you want cyphercam to be present in.
  - Replace `identity` object with the Bot's username, and oauth password.
  - It should look something like:
  ```
    identity: {
      username: 'cyphercam',
      password: 'oauth:yolo123102301',
    },
    channels: [
      'rickstergg',
      'another_friend_to_lurk',
      'yolo'
    ]
  ```
    - Note that streamers might be different on a per-channel basis, and that your streamer might have different rules about shoutouts, so no way around that just yet.
  - Adjust the `delay` which affects how quickly the bot will respond to events. Everything is in milliseconds, so 3500 is 3.5 seconds.
  - Add a `riotApiKey`, define a `region`, and the `defaultSummonerName` to be looked up when only `!rank` is typed.
  - Add a list of streamers to shoutout in the `streamers` array.
  - Add a list of VIP people to spew a custom message whenever they visit the channel in the `vips` array.
  - Add a list of Twitch usernames to ban in the `banList` array.
    - To run the commands, type `!ban list` into the chat when the bot has joined the channel. Make sure it has moderator capabilities!

4. Run the App, leave the terminal open as you stream or lurk!
  - In the root directory, run `node bot.js`.

5. Confirm that it's running correctly by typing into the channel when it's offline.
  - Some things to try
    - Adding yourself to the streamer list and then typing a message.
    - !rank or !rank teemo
    - !ban list

* Future Features
  - Anti hate raid detection
  - Better handling of VIPs
  - Integrate better with Twitch API to look up peoples previous streams and see what they were playing etc.
  - Spotify song integration, list the current song with !song or something.
