const Command = require("@bot/base/Command.js");

class ExecuteCMD extends Command {
    constructor (client) {
      super(client, {
        name: "execute",
        description: "Execute a console command. (Command Line Commands)",
        category: "System",
        usage: "<console command>",
        aliases: ['exec'],
        permLevel: "Site Admin",
        guildOnly: true,
      });
    }

    async run (client, message, args, MessageEmbed) {
      if(!args.join(' ')) return message.reply('Please input a console command.');
      let result = require('child_process').execSync(args.join(' ')).toString();
      const e = new MessageEmbed().addField('Result', `\`\`\`js\n${result.slice(0, 2000)}\`\`\``).setFooter(message.author.username, message.author.avatarURL()).setColor('GREEN');
      message.channel.send(e);
    }
}

module.exports = ExecuteCMD;