const Event = require('@bot/base/Event.js');
const colors = require('colors');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {
  constructor (client) {
    super(client, {
      name: 'message',
      enabled: true,
    });
  }

  async run (client, message) {
    const { author, channel, content, guild } = message;
    if (author.bot) return;
    if (guild && !channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")) return;
    //if (message.channel.id == "749432519681900576") message.react(message.guild.emojis.cache.find(e => e.name == "serverbooster"));

    const prefix = process.env.PREFIX;
    const fixedPrefix = escapeRegExp(prefix);
    const fixedUsername = escapeRegExp(client.user.username);

    const PrefixRegex = new RegExp(`^(<@!?${client.user.id}>|${fixedPrefix}|${fixedUsername})`, 'i', '(\s+)?');

    let usedPrefix = content.match(PrefixRegex);
    usedPrefix = usedPrefix && usedPrefix.length && usedPrefix[0];

    // Mention related tasks
    const MentionRegex = new RegExp(`^(<@!?${client.user.id}>)`);
    const mentioned = MentionRegex.test(content);
    const helpPrefix = `Sup, you can type \`${process.env.PREFIX}help\` for a list of comamnds!`;

    if(!usedPrefix) return; // Exit if its not using a prefix
    const args = message.content.slice(usedPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // If the member on a guild is invisible or not cached, fetch them.
    if (message.guild && !message.member) await message.guild.members.fetch(message.author);

    // Check whether the command, or alias, exist in the collections defined
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd && mentioned) return message.channel.send(helpPrefix);
    if (!cmd) return;

    if (cmd && !message.guild && cmd.conf.guildOnly) return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

    const level = client.permLevel(message);
    if (level < client.levelCache[cmd.conf.permLevel]) {
      const e = new MessageEmbed()
        .setTitle('Umm No..')
        .setColor('#2F3136')
        .setDescription(cmd.conf.permLevel == 'Lock' ? `The command you entered is disabled!` : `Last time I check, you are not a **${cmd.conf.permLevel}**...`)
        .setImage('https://discord.mx/TENvu8AirM.gif')
        .setFooter(cmd.conf.permLevel == 'Lock' ? `Error: COMMAND_DISABLED\nErType: Access Denied\nMade by Void Development (https://voiddevs.com/)` : `Error: INVALID_PERMISSIONS\nErType: Access Denied\nMade by Void Development (https://voiddevs.com/)`);
      message.channel.send(e);
      console.log(colors.yellow(`[${client.perms.find(l => l.level === level).name}] `) + colors.red(`${message.author.username} (${message.author.id}) `) + colors.white(`ran unauthorized command "`) + colors.red(`${cmd.help.name} ${args.join(' ')}`) + colors.white(`"`));
      return;
    }
    message.author.permLevel = level;

    message.flags = [];
    while (args[0] &&args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }

    // If the command exists, **AND** the user has permission, run it.
    //this.client.logger.log(`${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name} ${args.join(' ')}`, "cmd");

    cmd.run(client, message, args, MessageEmbed);
  }
};

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
