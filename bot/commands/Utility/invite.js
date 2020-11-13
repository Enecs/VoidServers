const Command = require('@bot/base/Command');
const Servers = require("@models/servers");

class InviteCMD extends Command {
    constructor (client) {
      super(client, {
        name: "invite",
        description: "Change Instant Invite to this channel. If [channel] is specified, create Instant Invite for that channel (Admin only)",
        category: "Utility",
        usage: "[channel]",
        aliases: ["invitechannel", "invitechan", "setinvite"],
        permLevel: "User"
      });
    }

    async run (client, message, args, MessageEmbed) {
        if(!message.guild.me.permissions.has(1)) return message.channel.send('I need the permission `CREATE_INVITE` for this command.');
        let selectedchannel = message.mentions.channels.first() || message.channel;

        let invite = await selectedchannel.createInvite({ maxAge: 0, maxUses: 0 }).catch(() => {});
        if(!invite) return message.channel.send(`I could not create an invite to ${selectedchannel}`);

        await Servers.updateOne({ guildid: message.guild.id }, {$set: { invite } })

		    const embed = new MessageEmbed()
        	.setColor('PURPLE')
        	.setFooter(message.author.username, message.author.avatarURL())
          .setTitle(`Void Servers » Invite Link`)
          .setDescription(`The Instant Invite has been set!`)
          .addField('Channel', `${selectedchannel}`)
          .addField('Instant Invite', `${invite}`)
        message.channel.send(embed);
    }
}

module.exports = InviteCMD;
