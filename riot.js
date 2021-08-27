const config = require('config');
const {
  riotApiKey,
  region,
  defaultSummonerName,
} = config.get('riot');
const TeemoJS = require('teemojs');
const riotApi = TeemoJS(riotApiKey);

const getLeagueRank = (summoner) => {
  let name = summoner || defaultSummonerName;
  return riotApi.get(region, 'summoner.getBySummonerName', name)
                .then(({ id: summonerId }) => riotApi.get(region, 'league.getLeagueEntriesForSummoner', summonerId))
                .then(data => data.find(league => league.queueType == 'RANKED_SOLO_5x5'));
}

module.exports = {
  getLeagueRank,
}
