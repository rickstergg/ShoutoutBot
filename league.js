const config = require('config');
const {
  riotApiKey,
  region,
  defaultSummonerName,
} = config.get('riot');

const TeemoJS = require('teemojs');
const riotApi = TeemoJS(riotApiKey);
const bent = require('bent');
const getJSON = bent('json');

const {
  getCooldownPercentage,
  getVersionsUrl,
  getChampUrl,
} = require('./utils.js');

const {
  champNames,
  bChampNames,
  validateChampName,
  validateAbilityHaste,
  validateSkillName
} = require('./validate.js');

const skillMapper = {
  q: 0,
  w: 1,
  e: 2,
  r: 3,
};

const getLeagueRank = (message) => {
  const summonerName = message.substr(6);
  let name = summonerName || defaultSummonerName;
  return riotApi.get(region, 'summoner.getBySummonerName', name)
                .then(({ id: summonerId }) => riotApi.get(region, 'league.getLeagueEntriesForSummoner', summonerId))
                .then(data => data.find(league => league.queueType == 'RANKED_SOLO_5x5'));
}

const getCooldowns = async (message) => {
  const [champName, skillName, abilityHaste] = message.split(' ').slice(1);

  if (!champName) {
    throw `Usage: !cd [champName] [skill] [ability haste], e.g. shen e 100`;
  }

  if (!validateChampName(champName)) {
    throw `Cannot find champ name: ${champName}.`;
  }

  if (!validateSkillName(skillName)) {
    throw `Skillname must be 'q', 'w', 'e', or 'r'.`;
  }

  if (abilityHaste && !validateAbilityHaste(abilityHaste)) {
    throw `Ability haste must be between 0 and 300.`;
  }

  const realChampName = champNames[champName] || bChampNames[champName];
  const [version, ...otherVersions] = await getJSON(getVersionsUrl());
  const champ = await getJSON(getChampUrl(version, realChampName));
  const spells = champ['data'][realChampName]['spells'];
  const spell = spells[skillMapper[skillName]];

  // The following code doesn't work cause sometimes the ID will be ShenE, and for some champs, ShenShadowDash
  // let spell = spells.find(skill => skill['id'] == `${realChampName}${skillName.toUpperCase()}`);
  // const spellCooldown = spell && spell['cooldown'] ? spell['cooldown'] : spells[index]['cooldown'];

  const percentageReduction = abilityHaste ? Math.floor(getCooldownPercentage(abilityHaste)) / 100 : 0;
  const cooldowns = spell['cooldown']
    .map(cd => parseFloat((cd * (1 - percentageReduction)).toFixed(1))
    .toString())
    .join(', ');
  return `${spell['name']}: ${cooldowns}`;
}

module.exports = {
  getCooldowns,
  getLeagueRank,
}
