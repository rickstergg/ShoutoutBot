const mods = {
  genosahjussi: 'The Super Special Soju Shitbutt King has fucking. ARRRIIIIIIIVED!',
  squatbunnie: 'The most innocent bunnie here!',
  ca5an0va: 'See you at Donnys bro.',
  stefybear: 'The one and only STEFYBWEAR!!',
  abr71310: 'He likes trains.',
  ptwister: 'Hello Dirty Bit Phil ;)',
};

const streamers = {
  // Mods who also stream
  genosahjussi: true,
  squatbunnie: true,
  stefybear: true,
  abr71310: true,
  ptwister: true,

  // Streamers
  nikomeleon: true,
  rwenc: true,
  sohba: true,
  imsajangim: true,
  bbymeryl: true,
  kimchi_pancakes12: true,
  xerisawx: true,
  shimmy: true,
  lilyeegirl: true,
  brennenwolf: true,
  metsuevil: true,
  xanohana: true,
  cykoboom: true,
  ptwister: true,
  '4xkitty': true,
  haezy_: true,
  jackiechaninakilt: true,
  hheo: true,
  qqobes33: true,
  epitomeme: true,
  ninav3v: true,
  soongdubu: true,
  variatea: true,
  jamatotv: true,
  suhbreenaa: true,
  serolimit: true,
  libra_michelle: true,
  melonpanmel: true,
  syulove_: true,
  littleJeanette: true,
  allydee153: true,
  howlingneko: true,
  kojanamiart: true,
  kynthiax: true,
  magicalmf_: true,
  SLAY_Moon: true,
  dddrewsky: true,
  WMWaffles: true,
  bcaiwong: true,
  cronzyx: true,
  jzx26: true,
  Honganhnt_: true,
  Ndroo: true,
  jenandjerrys: true,
  phoenixfreanzy: true,
  withchristine: true,
  gigi_the_cheese: true,
  Aurre: true,
  kxt_ryuujin: true,
  mylkbunny: true,
  Ruixrai: true,
  hochungyan: true,
  destructobunny: true,
  jesscuhz: true,
  itsallthepeaches: true,
  FenrirG: true,
  johnston1968: true,
  zfisher8: true,
  snackayy: true,
  fenrirg: true,
  kingbadbanana: true,
  itsmeangelac: true,
  kipkobi: true,
  jasmina: true,
  lacychu: true,
  itsaneek: true,
  onyemachittv: true,
  dabbinprincess: true,
  haimairrito: true,
  nanilemons: true,
  mysticpandass: true,
  nellnellnell: true,
  Chiver_Eric: true,
  shyguyjuju: true,
  thelaurasoria: true,
  ultravioletriot: true,
  yeeetusd3letus: true,
  prettyoddish: true
};

const vips = {
  meluvcandy1: true,
};

const greetMod = (username, displayName) => mods[username] ? mods[username] : `Thank you for modding, ${displayName}!`;
const greetVIP = (username, displayName) => vips[username] ? `HI BEEB!` : `Hello dere fam ;)`;
const greetStreamer = (username, displayName) => `!so ${displayName}`;

const isMod = username => mods[username];
const isVIP = username => vips[username];
const isStreamer = username => streamers[username];

module.exports = {
  greetMod,
  greetVIP,
  greetStreamer,
  isStreamer,
  isMod,
  isVIP,
}