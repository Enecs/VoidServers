require('dotenv').config();
require("module-alias/register");

process.env.ADMIN_USERS = String(process.env.ADMIN_USERS);

const VoidClient = require('@bot/base/BotClass.js');
const client = new VoidClient();

client.login(process.env.DISCORD_TOKEN).catch(err => console.log(err));

client.levelCache = {};
client.perms = require('@bot/base/Level');
for (let i = 0; i < client.perms.length; i++) {
  const thisLevel = client.perms[i];
  client.levelCache[thisLevel.name] = thisLevel.level;
}

String.prototype.toProperCase = function () {
  return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};
