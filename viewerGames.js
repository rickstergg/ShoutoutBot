
const exempt = [
  "abr71310",
  "ptwister",
  "ca5an0va",
  "squatbunnie",
  "fenrirg",
  "qqobes33",
  "bbymeryl",
  "cyphercam"
]

const botName = process.env.TWITCH_BOT_USERNAME;

import { getRandomElements, arraySubtract } from './utils.js';

export const thanos = (message, viewerList) => {
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

  const eligibleViewers = arraySubtract(viewerList, exempt + [botName]);
  const viewers = getRandomElements(eligibleViewers, numViewers);

  if (!viewers.length) {
    return Promise.reject(`Nobody eligible to timeout!`);
  }

  return Promise.resolve({
    viewers,
    duration,
  });
}
