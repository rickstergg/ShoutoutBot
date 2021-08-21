const tmi = require('tmi.js');
const config = require('config');
const { greetMod, greetVIP, greetStreamer, isStreamer, isMod, isVIP } = require('./utils.js');

// Get configurations
const twitchOpts = config.get('twitch');
const client = new tmi.client(twitchOpts);

const delay = config.get('delay');
const {
  riotApiKey,
  region,
  summonerName,
  summonerId,
} = config.get('riot');
const { spotifyApiKey } = config.get('spotify');

const alreadyShoutted = new Set();

const onRaidHandler = (channel, username, viewers) => {
  setTimeout(() => client.say(channel, `HOLY SHIT, thank you ${username} for the RAIDD! Welcome to the mind palace, raiders! Enjoy ya stay bb <3`, 10000));
}

const onMessageHandler = (target, context, msg, self) => {
  if (self) { return; }

  const {
    subscriber,
    username,
    'display-name': displayName,
    'user-id': userId
  } = context;

  if (alreadyShoutted.has(username)) { return; }

  isStreamer(username)
    ? setTimeout(() => client.say(target, greetStreamer(username, displayName)), delay)
    : console.log("=== DID NOT Greet ===", username, displayName);

  if (isMod(username)) { setTimeout(() => client.say(target, greetMod(username, displayName)), delay); }
  if (isVIP(username)) { setTimeout(() => client.say(target, greetVIP(username, displayName)), delay); }

  alreadyShoutted.add(username);
}

const onConnectedHandler = (addr, port) => console.log(`* Connected to ${addr}:${port}`);

client.on('raided', onRaidHandler);
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

client.connect();
