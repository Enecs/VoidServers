const Command = require('@bot/base/Command');
const Servers = require('@models/servers')

class BumpCMD extends Command {
    constructor (client) {
      super(client, {
        name: "bump",
        description: "Bump the server higher on the list.",
        category: "Utility",
        usage: "",
        aliases: ["bumpserver", "serverbump"],
        permLevel: "User"
      });
    }

    async run (client, message, args, MessageEmbed) {
        const embed = new MessageEmbed()
        	.setColor('PURPLE')
        	.setFooter(message.author.username, message.author.avatarURL())
            .setTitle(`Void Servers » Bump`)
        
        let server = await Servers.findOne({guildid: message.guild.id}, { _id: false })
        if(!server) { 
            embed.setDescription('An error occured, please contact a site administator.')
            return message.channel.send(embed);
        }
        
        const timeremain = getTimeRemaining(server.lastbumped)
		if(timeremain.days == 0) 
            if(timeremain.hours < 2) {
                embed.setDescription(`Too early! Please come back in \n${timeremain.hours} hours, ${timeremain.minutes} minutes, ${timeremain.seconds} seconds.`)
                return message.channel.send(embed)
            }
        await Servers.updateOne({ guildid: server.guildid }, {$set: { lastbumped: new Date(Date.parse(new Date())) } })
        
        embed.setDescription('Successfully bumped!')
        message.channel.send(embed);
    }
}

function getTimeRemaining(endtime) {
  const total = Date.parse(new Date()) - Date.parse(endtime);
  const seconds = 60 - Math.floor((total / 1000) % 60);
  const minutes = 59 - Math.floor((total / 1000 / 60) % 60);
  const hours = 1 - Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
}

module.exports = BumpCMD;
