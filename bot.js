const tmi = require('tmi.js');
const config = require('config');
const { greetMod, greetVIP, greetStreamer, isStreamer, isMod, isVIP } = require('./utils.js');

// Get Configurations
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

const onMessageHandler = (target, context, msg, self) => {
  if (self) { return; }

  const {
    subscriber,
    username,
    'display-name': displayName,
    'user-id': userId
  } = context;

  if (alreadyShoutted.has(username)) { return; }

  // Greet Streamer
  const streamer = isStreamer(username);
  if (streamer) {
    setTimeout(() => client.say(target, greetStreamer(username, displayName)), delay);
  } else {
    console.log("=== DID NOT Greet ===", username, displayName);
  }

  // Greet Mod
  const mod = isMod(username);
  if (mod) {
    setTimeout(() => client.say(target, greetMod(username, displayName)), delay);
  }

  // Greet VIPs
  const vip = isVIP(username);
  if (vip) {
    setTimeout(() => client.say(target, greetVIP(username, displayName)), delay);
  }

  alreadyShoutted.add(username);
}

const onConnectedHandler = (addr, port) => console.log(`* Connected to ${addr}:${port}`);

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

client.connect();