const config = require('config');
const thanosGame = config.get('thanos');
const { exempt } = thanosGame;

const { getRandomElements, arraySubtract } = require('./utils.js');

const thanos = (message, viewerList) => {
  const [numViewers, duration] = message.split(' ').slice(1);

  if (!numViewers || !duration) {
    return Promise.reject(`Usage: !thanos [number of viewers] [duration]. e.g. !thanos 2 60`);
  }

  if (!viewerList.length) {
    return Promise.reject(`There are no viewers to timeout in chat!`);
  }

  if (numViewers > viewerList.length) {
    return Promise.reject(`More timeouts requested than there are viewers to timeout!`);
  }

  const eligibleViewers = arraySubtract(viewerList, exempt);
  const viewers = getRandomElements(eligibleViewers, numViewers);

  return Promise.resolve({
    viewers,
    duration,
  });
}

module.exports = {
  thanos,
}