# What is this?

This is a ShoutoutBot which posts things like `!so [streamer]` or greeting messages in Twitch chat so my Mods can do less work! It's built on top of the `tmi.js`, and you can customize the names of VIPs, Mods, and Streamers who visit your channel, just follow the copy pasta and you're good to go!

# How do I run this?

1. Pre-requisites and Installation
  - Install the latest LTS of Node. As of now, I'm using `10.16.3`
  - Clone the repository to any directory you like.
  - Run `npm install` in the root directory you cloned into.

2. Twitch Bot and Identity Creation
  - Create a Twitch account for your bot if you haven't already. Mine is called CypherCam.
  - Generate a token for your bot [here](https://twitchapps.com/tmi/).
  - Make sure you're logged in as the bot and not your usual Twitch account when you do this!
  - The token starts with `oauth:` followed by an alphanumeric string.
  - Write this down, and don't show anybody else!

- Configuration
  - Modify the `bot.js` opts variable.
    - Replace `channels` with your own channel name.
    - Replace `identity` object with the Bot's username, and oauth password.
    - It should look something like:
    ```
      identity: {
        username: 'cyphercam',
        password: 'oauth:yolo123102301',
      },
      channels: [
        'rickstergg'
      ]
    ```
  - Modify the Streamers, Mods, and VIPs of your channel
    - Go to `utils.js`
    - Replace the list of people you want to shoutout.
    - Replace the shoutout message if you'd like!

4. Run the App, leave the terminal open as you stream!
  - In the root directory, run `node bot.js`.

5. Confirm that it's running correctly.
