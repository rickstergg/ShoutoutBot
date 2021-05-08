const tmi = require('tmi.js');
const { greetMod, greetVIP, greetStreamer, isStreamer, isMod, isVIP } = require('./utils.js');

const opts = {
  options: { debug: true, messagesLogLevel: "info" },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: 'your bots username',
    password: 'your bots passowrd',
  },
  channels: [
    'your channel name'
  ]
};

const client = new tmi.client(opts);

const alreadyShoutted = new Set();
const delay = 5000; // Delay in milliseconds for when to shoutout

const onMessageHandler = (target, context, msg, self) => {
  if (self) { return; }

  const {
    subscriber,
    username,
    'display-name': displayName,
    'user-id': userId
  } = context;

  if (alreadyShoutted.has(username)) { return; }

  // Greet Streamer
  const streamer = isStreamer(username);
  if (streamer) {
    setTimeout(() => client.say(target, greetStreamer(username, displayName)), delay);
  } else {
    console.log("=== DID NOT Greet ===", username, displayName);
  }

  // Greet Mod
  const mod = isMod(username);
  if (mod) {
    setTimeout(() => client.say(target, greetMod(username, displayName)), delay);
  }

  // Greet VIPs
  const vip = isVIP(username);
  if (vip) {
    setTimeout(() => client.say(target, greetVIP(username, displayName)), delay);
  }

  alreadyShoutted.add(username);
}

const onConnectedHandler = (addr, port) => console.log(`* Connected to ${addr}:${port}`);

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

client.connect();
