const config = require('config');
const tmi = require('tmi.js');
const bent = require('bent');
const getJSON = bent('json');

const { formatLeagueRank, getCooldownPercentage, greetMod, greetVIP, greetStreamer, isStreamer, isMod, isVIP } = require('./utils.js');
const { champNames, bChampNames, validateChampName, validateCooldown, validateSkillName } = require('./validate.js');
const { getLeagueRank } = require('./riot.js');

const twitchOpts = config.get('twitch');
const client = new tmi.client(twitchOpts);

const delay = config.get('delay');
const {
  spotifyClientId,
  spotifyClientSecret,
} = config.get('spotify');

const alreadyShoutted = new Set();

const handleCommands = async (channel, displayName, message) => {
  if (message == 'Wanna become famous? Buy followers, primes and viewers on bigfollows . com !') {
    client.say(channel, `/ban ${displayName}`);
    client.say(channel, `${displayName}, Rickster is already famous, don't test me.`);
    return;
  }

  // !ban

  if (message == '!rank') {
    // Get the rank to take in a summoner name period
    // include the platform too pls
    getLeagueRank()
      .then(solo => client.say(channel, formatLeagueRank(solo), delay))
      .catch(r => {
        console.log(r);
        client.say(channel, "Can't get rank, we done goofed", delay);
      });
  }

  if (message.includes('!cd')) {
    const [champName, skillName, cooldown] = message.split(' ').slice(1);

    if (!validateChampName(champName)) {
      client.say(channel, `Cannot find champ name: ${champName}`, delay);
      return;
    }

    if (!validateSkillName(skillName)) {
      client.say(channel, `Skillname must be 'q', 'w', 'e', or 'r' for now! Got ${skillName}`, delay);
      return;
    }

    if (cooldown && !validateCooldown(cooldown)) {
      client.say(channel, `Cooldown must be in the form of ability haste, 0 <= num <= 150`, delay);
      return;
    }

    const realChampName = champNames[champName];
    const url = `http://ddragon.leagueoflegends.com/cdn/11.16.1/data/en_US/champion/${realChampName}.json`;
    const champ = await getJSON(url);
    const spells = champ['data'][realChampName]['spells'];
    const spellCooldown = spells.find(skill => skill['id'] == `${realChampName}${skillName.toUpperCase()}`)['cooldown'];

    if (cooldown) {
      const percentage = Math.floor(getCooldownPercentage(cooldown)) / 100;
      const cooldownsWithReduction = spellCooldown.map(cd => parseFloat((cd * (1 - percentage)).toFixed(2)).toString()).join(', ');
      client.say(channel, `${realChampName} ${skillName.toUpperCase()}: ${cooldownsWithReduction}`, delay);
    } else {
      client.say(channel, `${realChampName} ${skillName.toUpperCase()}: ${spellCooldown.join(', ')}`, delay);
    }
  }
}

const onRaidHandler = (channel, username, viewers) => {
  console.log(`=== RAID for ${viewers} viewers from ${username} ===`);
  setTimeout(() => client.say(channel, `HOLY SHIT, thank you ${username} for the RAIDD! Welcome to the mind palace, raiders! Enjoy ya stay bb <3`, 7000));
  setTimeout(() => client.say(channel, `!so ${username}`, 8000));
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

  handleCommands(channel, displayName, message);

  if (alreadyShoutted.has(username)) { return; }

  if (isStreamer(username)) { setTimeout(() => client.say(channel, greetStreamer(username, displayName)), delay); }
  if (isMod(username)) { setTimeout(() => client.say(channel, greetMod(username, displayName)), delay); }
  if (isVIP(username)) { setTimeout(() => client.say(channel, greetVIP(username, displayName)), delay); }

  console.log("=== SAW ", username, displayName, " ===");
  alreadyShoutted.add(username);
}

const onConnectedHandler = (addr, port) => console.log(`* Connected to ${addr}:${port}`);

// host one too
client.on('raided', onRaidHandler);
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

client.connect();
