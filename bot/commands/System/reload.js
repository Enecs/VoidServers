const Command = require("@bot/base/Command.js");

class Reload extends Command {
  constructor (client) {
    super(client, {
      name: "reload",
      description: "Reloads a command that has been modified.",
      category: "System",
      usage: "[command]",
      aliases: ['r', 'rl'],
      permLevel: "Site Admin",
      guildOnly: true,
    });
  }

  async run (client, message, args, MessageEmbed) { // eslint-disable-line no-unused-vars
    let em = new MessageEmbed();
    if (!args || args.length < 1) return em.setDescription(`Must provide a command or an event to reload.`).setColor('RED') && message.reply(em);

    const commands = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
    const events = client.events.get(args[0]);
    if(commands) {
      let response = await client.unloadCommand(commands.conf.location, commands.help.name);
      if (response) return em.setDescription(`Error unloading command: ${response}`).setColor('RED') && message.channel.send(em);

      response = client.loadCommand(commands.conf.location, commands.help.name);
      if (response) return em.setDescription(`Error loading command: ${response}`).setColor('RED') && message.channel.send(em);

      em.setDescription(`The command \`${commands.help.name}\` has been reloaded`).setColor('GREEN')
      message.channel.send(em);
    }else if(events){
      //let response = await client.unloadEvent(events.conf.location, events.conf.name);
      //if (response) return em.setDescription(`Error unloading event: ${response}`).setColor('RED') && message.channel.send(em);

      //let response = await client.reloadEvent(events.conf.location, events.conf.name);
      //if (response) return em.setDescription(`Error reloading event: ${response}`).setColor('RED') && message.channel.send(em);

      //em.setDescription(`The event \`${events.conf.name}\` has been reloaded`).setColor('GREEN')
      em.setDescription(`The events cannot be reloaded yet.`).setColor('RED')
      message.channel.send(em);
    }else{
      em.setDescription(`\`${args[0]}\` does not exist, nor is it an alias.`).setColor('RED');
      return message.channel.send(em);
    }
  }
}
module.exports = Reload;
