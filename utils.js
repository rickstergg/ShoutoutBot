const config = require('config');
const streamers = config.get('streamers');
const vips = config.get('vips');

const greetVIP = (username, displayName) => `HI BEEB!`;
const greetStreamer = (username, displayName) => `!so ${displayName}`;

const isVIP = username => vips.includes(username);
const isStreamer = username => streamers.includes(username);
const formatLeagueRank = ({ tier, rank, leaguePoints, hotStreak }) => `${tier} ${rank} - ${leaguePoints} LP ${hotStreak ? '🔥' : ''}`;

const getCooldownPercentage = cooldown => {
  const cd = parseFloat(cooldown);
  return (1 - (1 / (1 + (cooldown / 100)))) * 100;
};

const getVersionsUrl = () => 'https://ddragon.leagueoflegends.com/api/versions.json';
const getChampUrl = (version, champ) => `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${champ}.json`;

module.exports = {
  formatLeagueRank,
  getCooldownPercentage,
  getChampUrl,
  getVersionsUrl,
  greetVIP,
  greetStreamer,
  isStreamer,
  isVIP,
}
