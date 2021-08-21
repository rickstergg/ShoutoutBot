const config = require('config');
const tmi = require('tmi.js');
const { formatLeagueRank, greetMod, greetVIP, greetStreamer, isStreamer, isMod, isVIP } = require('./utils.js');
const { getLeagueRank } = require('./riot.js');

// Get configurations
const twitchOpts = config.get('twitch');
const client = new tmi.client(twitchOpts);

const delay = config.get('delay');
const { spotifyApiKey } = config.get('spotify');

const alreadyShoutted = new Set();

const onRaidHandler = (channel, username, viewers) => {
  setTimeout(() => client.say(channel, `HOLY SHIT, thank you ${username} for the RAIDD! Welcome to the mind palace, raiders! Enjoy ya stay bb <3`, 10000));
}

const onMessageHandler = (channel, context, msg, self) => {
  if (self) { return; }

  const {
    subscriber,
    username,
    'display-name': displayName,
    'user-id': userId
  } = context;

  if (msg == '!rank') {
    getLeagueRank()
      .then(solo => client.say(channel, formatLeagueRank(solo), delay))
      .catch(r => {
        console.log(r);
        client.say(channel, "Can't get rank, we done goofed", delay);
      });
  }

  if (alreadyShoutted.has(username)) { return; }

  isStreamer(username)
    ? setTimeout(() => client.say(channel, greetStreamer(username, displayName)), delay)
    : console.log("=== DID NOT Greet ===", username, displayName);

  if (isMod(username)) { setTimeout(() => client.say(channel, greetMod(username, displayName)), delay); }
  if (isVIP(username)) { setTimeout(() => client.say(channel, greetVIP(username, displayName)), delay); }

  alreadyShoutted.add(username);
}

const onConnectedHandler = (addr, port) => console.log(`* Connected to ${addr}:${port}`);

client.on('raided', onRaidHandler);
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

client.connect();
