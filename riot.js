const config = require('config');
const {
  riotApiKey,
  region,
  summonerName,
} = config.get('riot');
const TeemoJS = require('teemojs');
const riotApi = TeemoJS(riotApiKey);

const getLeagueRank = () => {
  return riotApi.get(region, 'summoner.getBySummonerName', summonerName)
                .then(({ id: summonerId }) => riotApi.get(region, 'league.getLeagueEntriesForSummoner', summonerId))
                .then(data => data.find(league => league.queueType == 'RANKED_SOLO_5x5'));
}

module.exports = {
  getLeagueRank,
}
