import config from 'config';
const streamers = config.get('streamers');
const vips = config.get('vips');

export const arraySubtract = (array1, array2) => array1.filter(element => !array2.includes(element));
export const greetVIP = (username, displayName) => `HI BEEB!`;
export const greetStreamer = (username, displayName) => `!so ${displayName}`;
export const isVIP = username => vips.includes(username);
export const isStreamer = username => streamers.includes(username);
export const formatLeagueRank = ({ tier, rank, leaguePoints, hotStreak }) => `${tier} ${rank} - ${leaguePoints} LP ${hotStreak ? '🔥' : ''}`;
export const getCooldownPercentage = cooldown => (1 - (1 / (1 + (cooldown / 100)))) * 100;
export const getVersionsUrl = () => 'https://ddragon.leagueoflegends.com/api/versions.json';
export const getChampUrl = (version, champ) => `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${champ}.json`;

export const getRandomElements = (arr, n) => {
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

export const getRandomInt = max => {
  return Math.ceil(Math.random() * max);
}
