const Event = require('@bot/base/Event.js');
const Servers = require('@models/servers');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class extends Event {
  constructor (client) {
    super(client, {
      name: 'guildDelete',
      enabled: true,
    });
  }

  async run (client, guild) {
    await Servers.findOneAndDelete({guildid: guild.id});

    // Log it.
    const e = new MessageEmbed()
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL())
      .setColor('RED')
      .addField('Owner', `${guild.owner.user.tag} \`(${guild.owner.user.id})\``, true)
      .addField('Member Count', guild.members.cache.size, true)
      .addField('\u200b', '\u200b', true)
      .addField('Guild ID', guild.id, true)
      .addField('Created At', moment(guild.createdAt).format("LLL"), true)
    client.channels.cache.get(process.env.GUILD_LOG).send(e);
    client.logger.log(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);
  }
};
