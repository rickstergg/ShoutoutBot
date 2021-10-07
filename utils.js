const config = require('config');
const streamers = config.get('streamers');
const vips = config.get('vips');

const arraySubtract = (array1, array2) => array1.filter(element => !array2.includes(element));
const greetVIP = (username, displayName) => `HI BEEB!`;
const greetStreamer = (username, displayName) => `!so ${displayName}`;
const isVIP = username => vips.includes(username);
const isStreamer = username => streamers.includes(username);
const formatLeagueRank = ({ tier, rank, leaguePoints, hotStreak }) => `${tier} ${rank} - ${leaguePoints} LP ${hotStreak ? '🔥' : ''}`;
const getCooldownPercentage = cooldown => (1 - (1 / (1 + (cooldown / 100)))) * 100;
const getVersionsUrl = () => 'https://ddragon.leagueoflegends.com/api/versions.json';
const getChampUrl = (version, champ) => `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${champ}.json`;

const getRandomElements = (arr, n) => {
  var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
      throw 'getRandom: more elements taken than available';
  while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

const getRandomInt = max => {
  return Math.ceil(Math.random() * max);
}

module.exports = {
  arraySubtract,
  formatLeagueRank,
  getCooldownPercentage,
  getChampUrl,
  getRandomElements,
  getRandomInt,
  getVersionsUrl,
  greetVIP,
  greetStreamer,
  isStreamer,
  isVIP,
}
