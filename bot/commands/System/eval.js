'use strict';
const Command = require("@bot/base/Command.js");
const { inspect } = require('util');

class Eval extends Command {
  constructor (client) {
    super(client, {
      name: "eval",
      description: "Evaluates arbitrary Javascript.",
      category: "System",
      usage: "<expression>",
      aliases: ["evaluate"],
      permLevel: "Site Admin",
      guildOnly: true,
    });
  }

  async run (client, message, args, MessageEmbed) {
    const { member, author, channel, guild } = message;
    const embed = new MessageEmbed()
      .setFooter(message.author.username, message.author.avatarURL())
    const query = args.join(' ')
    if (query) {
      const code = (lang, code) => (`\`\`\`${lang}\n${String(code).slice(0, 1000) + (code.length >= 1000 ? '...' : '')}\n\`\`\``).replace(client.token,"Really...? I'm not going to give you my token...")
      try {
        const evald = eval(query)
        const res = (typeof evald === 'string' ? evald : inspect(evald, { depth: 0 }))
        embed.addField('Result', code('js', res))
          .addField('Type', code('css', typeof evald === 'undefined' ? 'Unknown' : typeof evald))
          .setColor('#8fff8d')
      } catch (err) {
        embed.addField('Error', code('js', err))
          .setColor('#ff5d5d')
      } finally {
        message.channel.send(embed).catch(err => {
            message.channel.send(`There was an error while displaying the eval result! ${err.message}`)
          })
      }
    } else {
      message.channel.send('Attempting to evaluate nothing.....')
      message.channel.send('I got nothing...')
      message.channel.send('Maybe... Yah know... Try telling me something to evaluate next time?')
    }
  }
}

module.exports = Eval;
