import tmi from 'tmi.js';
import config from 'config';
import axios from 'axios';
import chalk from 'chalk';

import {
  formatLeagueRank,
  greetVIP,
  greetStreamer,
  isStreamer,
  isVIP
} from './utils.js';

import {
  getLeagueRank,
  getCooldowns,
} from './league.js';

import {
  thanos,
} from './viewerGames.js';

const twitchOpts = config.get('twitch');
const twitch = new tmi.client(twitchOpts);

const delay = config.get('delay');
const alreadyShoutted = new Set();

let viewers = {};
let players = {};
let joinable = false;

const listenForJoins = (channel, message) => {
  players = {};
  joinable = true;

  // NOTE: Assumes it's a one param command
  const tokenized = message.split(' ');
  const duration = tokenized.length > 1 ? tokenized[tokenized.length - 1] : 120;

  setTimeout(() => {
    twitch.say(channel, `Halfway till the raffle is closed! Get your '!join' in chat right NAO!`);
  }, (duration / 2) * 1000);

  return new Promise(resolve => {
    joinable = true;
    setTimeout(() => {
      joinable = false;
      console.log('=== LIST OF PLAYERS HERE ===');
      twitch.say(channel, `The joining phase is now closed. ${Object.keys(players).length} players yolo-ing.`);
      resolve(players);
    }, duration * 1000);
  });
}

const handleJoins = async (channel, displayName, message) => {
  if (message == '!join' && joinable) {
    if (players[displayName]) {
      console.log(displayName, 'already joined game!');
      twitch.say(channel, `${displayName}, you've already joined bb!`);
    } else {
      players[displayName] = true;
      console.log(displayName, 'joined game');
    }
  }

  if (message == '!leave' && joinable) {
    console.log(displayName, 'left game!');
    delete players[displayName];
  }
}

// Fetch domain extensions to assist with check for big follows
let domainExtensions = [];
axios
  .get("https://data.iana.org/TLD/tlds-alpha-by-domain.txt")
  .then((response) => domainExtensions = response.data.trim().split("\n").slice(1) || [])
  .catch((err) => console.log(chalk.red("Can't fetch domain extensions, defaulting to empty array.", err)));

const handleBigFollows = (channel, displayName, message) => {
  const msg = message.toLowerCase();
  let count = 0;

  if (msg.includes('famous')) {
    count += 1;
  }

  if (msg.includes('buy')) {
    count += 1;
  }

  if (msg.includes('followers')) {
    count += 1;
  }

  if (msg.includes('primes')) {
    count += 1;
  }

  if (msg.includes('viewers')) {
    count += 1;
  }

  const msgExtension = msg.split('. ').pop()
  if (domainExtensions.includes(msgExtension.toUpperCase()) ) {
    count += 2;
  }

  if (msg.includes('bigfollows') || msg.includes('bigf')) {
    count += 2;
  }

  if (count > 3) {
    twitch.say(channel, `/ban ${displayName}`);
    twitch.say(channel, `${displayName}, don't test me - Rick already did. ${count} pts.`);
  }
}

const handleCommandsAndMessages = async (channel, displayName, message, broadcaster) => {
  if (message.startsWith('!raffle')) {
    if (!broadcaster) {
      twitch.say(channel, `Sorry, only the broadcaster can start the raffle. ;)`, delay);
      return;
    }

    twitch.say(channel, `▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬ PowerUpL HolidayPresent The raffle has BEGUN! HolidayPresent PowerUpR Type '!join' to get in on DEEZ NUTS. ▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬`, delay);
    listenForJoins(channel, message)
      .then(playerList => {
        twitch.say(channel, 'The raffle is over!');
        console.log(Object.keys(playerList).join('\r\n'));
      });
  }

  if (message.startsWith('!thanos')) {
    if (!broadcaster) {
      twitch.say(channel, `Sorry, only Thanos can snap the fingers. ;)`);
      return;
    }

    thanos(message, Object.keys(viewers))
      .then(({ viewers, duration }) => viewers.map(viewer => twitch.say(channel, `/timeout ${viewer} ${duration}`)))
      .catch(err => twitch.say(channel, err, delay));
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

  if (message.startsWith('!reset')) {
    if (!broadcaster) {
      twitch.say(channel, `Sorry, only the broadcaster can reset me. ;)`, delay);
      return;
    }

    alreadyShoutted.clear();
    viewers = {};
    players = {};
    joinable = false;

    twitch.say(channel, `Reset triggered!`, delay);
  }
}

const handleViewerList = username => {
  if (!viewers[username]) {
    viewers[username] = true;
  }
}

const handleShoutouts = (channel, username, displayName) => {
  if (alreadyShoutted.has(username)) { return; }
  if (isStreamer(username)) { setTimeout(() => twitch.say(channel, greetStreamer(username, displayName)), delay); }
  if (isVIP(username)) { setTimeout(() => twitch.say(channel, greetVIP(username, displayName)), delay); }
  console.log(chalk.yellow(`=== SAW ${username} ${displayName} ===`));
  alreadyShoutted.add(username);
}

const onMessageHandler = (channel, context, message, self) => {
  if (self) { return; }

  const {
    subscriber,
    username,
    mod,
    badges,
    'display-name': displayName,
    'user-id': userId,
  } = context;

  const broadcaster = badges ? badges.broadcaster : null;

  handleViewerList(username);
  handleBigFollows(channel, displayName, message);
  handleJoins(channel, displayName, message);
  handleShoutouts(channel, username, displayName);
  handleCommandsAndMessages(channel, displayName, message, broadcaster);
}

const onRaidHandler = (channel, username, viewers) => {
  console.log(chalk.blue(`=== RAID for ${viewers} viewers from ${username} ===`));
  setTimeout(() => twitch.say(channel, `HOLY SHIT, thank you ${username} for the RAIDD!`, delay));
  setTimeout(() => twitch.say(channel, `!so ${username}`, delay * 2));
  alreadyShoutted.add(username);
}

// Only happens if you are logged in / authed as the broadcaster
const onHostHandler = (channel, username, viewers, autohost) => {
  console.log(chalk.blue(`=== HOST for ${viewers} viewers from ${username} ===`));
  setTimeout(() => twitch.say(channel, `Thank you SO MUCH for the host, ${username}!`, delay));
  setTimeout(() => twitch.say(channel, `!so ${username}`, delay * 2));
  alreadyShoutted.add(username);
}

const onJoinHandler = (channel, username, self) => {
  viewers[username] = true;
  console.log(chalk.green(`${username} has joined the channel`));
}

const onLeaveHandler = (channel, username, self) => {
  delete viewers[username];
  // console.log(username, 'has left the channel');
}

const onResubHandler = (channel, username, months, message, userstate, methods) => {
  let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
  setTimeout(() => twitch.say(channel, `Thank you ${username} for resubbing for ${cumulativeMonths} months! Welcome back to the mind palace!!`, delay));
}

const onConnectedHandler = (addr, port) => console.log(`* Connected to ${addr}:${port}`);

// More kinds of events can be implemented here!
// https://github.com/tmijs/docs/blob/gh-pages/_posts/v1.4.2/2019-03-03-Events.md
twitch.on('connected', onConnectedHandler);
twitch.on('part', onLeaveHandler);
twitch.on('join', onJoinHandler);
twitch.on('raided', onRaidHandler);
twitch.on('message', onMessageHandler);
twitch.on('hosted', onHostHandler);
twitch.on('resub', onResubHandler);
twitch.connect();