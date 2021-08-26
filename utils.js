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

module.exports = {
  formatLeagueRank,
  getCooldownPercentage,
  greetVIP,
  greetStreamer,
  isStreamer,
  isVIP,
}
