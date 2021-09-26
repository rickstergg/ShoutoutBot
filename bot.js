const tmi = require('tmi.js');
const config = require('config');

const {
  formatLeagueRank,
  greetVIP,
  greetStreamer,
  isStreamer,
  isVIP
} = require('./utils.js');

const {
  getLeagueRank,
  getCooldowns,
} = require('./league.js');

const twitchOpts = config.get('twitch');
const delay = config.get('delay');
const {
  spotifyClientId,
  spotifyClientSecret,
} = config.get('spotify');

const twitch = new tmi.client(twitchOpts);

const alreadyShoutted = new Set();

const ban = (channel, name) => {
  twitch.say(channel, `/ban ${name}`);
}

const handleCommandsAndMessages = async (channel, displayName, message) => {
  if (message == 'Wanna become famous? Buy followers, primes and viewers on bigfollows . com !') {
    ban(channel, displayName);
    twitch.say(channel, `${displayName}, Rickster is already famous, don't test me.`);
    return;
  }

  if (message.startsWith('!rank')) {
    getLeagueRank(message)
      .then(solo => twitch.say(channel, formatLeagueRank(solo), delay))
      .catch(err => twitch.say(channel, `The summoner '${summonerName}' is not ranked for solo/duo!`, delay));
  }

  if (message.startsWith('!cd')) {
    getCooldowns(message)
      .then(cooldowns => twitch.say(channel, cooldowns, delay))
      .catch(err => twitch.say(channel, err, delay));
  }
}

const handleShoutouts = (channel, username, displayName) => {
  if (alreadyShoutted.has(username)) { return; }
  if (isStreamer(username)) { setTimeout(() => twitch.say(channel, greetStreamer(username, displayName)), delay); }
  if (isVIP(username)) { setTimeout(() => twitch.say(channel, greetVIP(username, displayName)), delay); }
  console.log("=== SAW ", username, displayName, " ===");
  alreadyShoutted.add(username);
}

const onRaidHandler = (channel, username, viewers) => {
  console.log(`=== RAID for ${viewers} viewers from ${username} ===`);
  setTimeout(() => twitch.say(channel, `HOLY SHIT, thank you ${username} for the RAIDD! Welcome to the mind palace, raiders! Enjoy ya stay bb <3`, 7000));
  setTimeout(() => twitch.say(channel, `!so ${username}`, 8000));
  alreadyShoutted.add(username);
}

const onMessageHandler = (channel, context, message, self) => {
  if (self) { return; }

  const {
    subscriber,
    username,
    'display-name': displayName,
    'user-id': userId,
  } = context;

  handleCommandsAndMessages(channel, displayName, message);
  handleShoutouts(channel, username, displayName);
}

const onConnectedHandler = (addr, port) => console.log(`* Connected to ${addr}:${port}`);

// host one too
twitch.on('raided', onRaidHandler);
twitch.on('message', onMessageHandler);
twitch.on('connected', onConnectedHandler);

twitch.connect();
