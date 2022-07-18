# What is this?

This is a Twitch Chatbot built on top of `tmi.js` and can be configured via the `default.json` file. Pull it locally, populate the settings with your own configuration, add in some optional API keys, and you got a bot that can do some serious werk for your own channels or channels you mod for!

# Features

* Automatically shoutsout streamers and friends of the channel when they type in chat. Managed manually by a list of streamers of your choice!
* Automatically shoutsout streamers who raid you! Customize the message at it contains profanity. ;3
* Automatically bans any account that says a few words in the legendary big follows sentence. They keep changing how they say it, but we just update it to match.

![cyphercam in action](https://user-images.githubusercontent.com/13734404/159748359-c25b2a27-9563-4d1f-ac3e-2ea716c8a6eb.PNG)
* Customizable delay duration so it's instantaneous or - on the other hand - doesn't seem robotic.
* Handles !raffle commands with a parameter for duration. e.g. !raffle 120 will create a raffle viewers can join using !join and it'll listen for 2 minutes! Spits out a list of players / potential winners for you to use in conjunction with https://wheelofnames.com/ or something similar.
* Also comes with some fun games like !thanos, which times out random people in the channel for a certain duration of time.


The following features require a Riot Games API Key:

Note: I'll include a check for these commands in the future, but if you don't have a riot API key, make sure you comment these commands out, cause it'll likely crash the program if you're live!

* Responds to `!rank` commands, particularly League of Legends for now.
  * e.g. `!rank` or `!rank summoner name`
* Grabs LoL champion spell cooldowns and accepts ability haste as a parameter (no more mobafire / leaguepedia lookups)!
  * e.g. `!cd shen e 100`
  * Returns `Shen E: 9, 8, 7, 6, 5`

# How do I run this?

1. Pre-requisites and Installation
  - Install the latest LTS of Node.
  - Clone the repository to any directory you like.
  - Run `npm install` in the root directory you cloned into.

2. Twitch Bot and Identity Creation
  - Create a Twitch account for your bot if you haven't already. Mine is called CypherCam.
  - Generate a token for your bot [here](https://twitchapps.com/tmi/).
  - Make sure you're logged in as the bot and not your usual Twitch account when you do this! Unless you want your main broadcaster account to do these shoutouts and stuff. I think it's cooler to have a bot to do it, but personal preference.
  - The token starts with `oauth:` followed by an alphanumeric string.
  - Write this down, and don't show anybody else!

- Configuration: modify the `config/default.json` file in the config directory.
  - Replace `channels` with your own channel name or a list of channels you want cyphercam to be present in.
  - Replace the `username` & `password` with the Bot's username, and oauth password under the `identity` object.
  - It should look something like:
  ```
    identity: {
      username: 'cyphercam',
      password: 'oauth:yolo123102301',
    },
    channels: [
      'yourchannel69'
    ]
  ```
  - Adjust the `delay` which affects how quickly the bot will respond to events. Everything is in milliseconds, so 3500 is 3.5 seconds.
  - Add a `riotApiKey`, define a `region` ('NA1'), and the `defaultSummonerName` to be looked up when only `!rank` is typed.
  - Add a list of streamers to shoutout in the `streamers` array.
  - Add a list of VIP people to spew a custom message whenever they visit the channel in the `vips` array.

4. Run the App, leave the terminal open as you stream or lurk!
  - In the root directory, run `node bot.js`.

5. Confirm that it's running correctly by typing into the channel when it's offline and with CypherCam running.
  - Some things to try:
    - Adding yourself to the streamer list and then typing a message.
    - `!rank` or `!rank SummonerName`

* Future Features
  - Stats counter. Looking to thank your viewers / resubs / gifted? Type !stats at the end of your stream to get a list of all the things that happened!! All you'll need to do are replace the usernames with @'s in discord and whatnot.
  - Better handling of VIPs (currently just shouts out my gf LOL)
  - Integrate better with Twitch API to look up peoples previous streams and see what they were playing etc.
  - DEEZ NUTS a random word on stream
  - Provide optional param for raffle to select a winner(s)
  - Spotify song integration, list the current song with !song or something.

# Thank yous

Huge props to all these lovely friends and streamers for helping me test CypherCam and trusting the project with modding their communities.

* [Kobes](https://www.twitch.tv/qqobes33)
* [Laura](https://www.twitch.tv/thelaurasoria)
* [Sachiee](https://www.twitch.tv/sachimusix)
* [Beita](https://www.twitch.tv/beita)
* [Jess](https://www.twitch.tv/jessisamess3)
* [Queenie](https://www.twitch.tv/queenie_panda)
* [Archy](https://www.twitch.tv/archhion)
* [Jama](https://www.twitch.tv/jamatotv)

and a few more, behind the scenes ;)
