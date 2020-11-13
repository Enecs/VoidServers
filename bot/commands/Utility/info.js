const Command = require("@bot/base/Command.js");
const Servers = require("@models/servers");
const moment = require('moment');

class InfoCMD extends Command {
    constructor (client) {
      super(client, {
        name: "info",
        description: "Get information about a server.",
        category: "Utility",
        usage: "[server name/server_id]",
        aliases: ['si', 'serinfo', 'serverinfo'],
        permLevel: "User",
        guildOnly: true,
      });
    }

    async run (client, message, args, MessageEmbed) {
        let infoGuild = message.guild;
        if (!args || args.length < 1) {
          infoGuild = message.guild;
        } else {
          infoGuild = client.guilds.cache.find(m => m.id === `${args.join(' ')}`) || client.guilds.cache.find(m => m.name.toUpperCase() === `${args.join(' ').toUpperCase()}`) || client.guilds.cache.find(m => m.name.toLowerCase().includes(`${args.join(' ').toLowerCase()}`));;
        }

        if (!infoGuild) {
          infoGuild = message.guild;
          //const e = new MessageEmbed()
          // .setColor('RED')
          // .setDescription('There might be duplicates of that server\'s name or I dont have a guild with that name')
          //return message.channel.send(e);
        }

        let dbInfo = await Servers.findOne({guildid: infoGuild.id}, { _id: false })
        if (!dbInfo) {
          const e = new MessageEmbed()
            .setColor('RED')
            .setDescription('That guild is not in our dB. Contact a site admin.')
          return message.channel.send(e);
        }

        // return console.log(infoGuild);

        const then = moment(infoGuild.createdAt);
        const time = then.from(moment());
        const ca = then.format("MMM Do, YYYY");

        // const roles = infoGuild.roles.cache.sort((a, b) => b.position - a.position);
        // let roles1 = roles.array().join(', ');
        // if (roles1 === undefined || roles1.length == 0) roles1 = "No Roles";
        // if (roles1.length > 1020) {
        //     roles1 = roles1.substring(0, 1020).replace(/,[^,]+$/, "");
        //     roles1 = roles1 + " ...";
        // }

        let lvl = "", lvlnum = 0;
        switch (infoGuild.verificationLevel.toProperCase()) {
          case "None":
            lvl = "None"
            lvlnum = 0;
            break;

          case "Low":
            lvl = "Low"
            lvlnum = 1;
            break;

          case "Medium":
            lvl = "Medium"
            lvlnum = 2;
            break;

          case "High":
            lvl = "(╯°□°）╯︵ ┻━┻"
            lvlnum = 3;
            break;

          case "Very_high":
            lvl = "┻━┻彡 ヽ(ಠ益ಠ)ノ彡┻━┻'"
            lvlnum = 4;
            break;

          default:
            break;
        }

        let flag = ":map:";
        if (infoGuild.region.toProperCase() == "Brazil") flag = ":flag_br:"
        if (infoGuild.region.toProperCase() == "Europe") flag = ":flag_eu:"
        if (infoGuild.region.toProperCase() == "Hongkong") flag = ":flag_hk:"
        if (infoGuild.region.toProperCase() == "India") flag = ":flag_in:"
        if (infoGuild.region.toProperCase() == "Japan") flag = ":flag_jp:"
        if (infoGuild.region.toProperCase() == "Russia") flag = ":flag_ru:"
        if (infoGuild.region.toProperCase() == "Singapore") flag = ":flag_sg:"
        if (infoGuild.region.toProperCase() == "Southafrica") flag = ":flag_ss:"
        if (infoGuild.region.toProperCase() == "Sydney") flag = ":flag_sh:"
        if (["Us-Central", "Us-West", "Us-East", "Us-South"].includes(infoGuild.region.toProperCase())) flag = ":flag_us:"

        let color = "LUMINOUS_VIVID_PINK";
        if(dbInfo && dbInfo.styles && dbInfo.styles.background) {
          if(dbInfo.styles.background == "rbg") color = "#FF0000";
          if(dbInfo.styles.background == "bgg") color = "#0009FF";
          if(dbInfo.styles.background == "pyb") color = "#AB00FF";
          if(dbInfo.styles.background == "pcg") color = "#FF00F1";
          if(dbInfo.styles.background == "oyg") color = "#FF5E00";
          if(dbInfo.styles.background == "lcg") color = "#30FF00";
          if(dbInfo.styles.background == "plg") color = "#E700FF";
          if(dbInfo.styles.background == "pog") color = "#FF8000";
          if(dbInfo.styles.background == "bcg") color = "#1D00FF";
          if(dbInfo.styles.background == "rdg") color = "#B91515";
          if(dbInfo.styles.background == "pdg") color = "#5D03DB";
          if(dbInfo.styles.background == "blk") color = "#010101";
          if(dbInfo.styles.background == "db") color = "#7289DA";
          if(dbInfo.styles.background == "dnqb") color = "#23272A";
          if(dbInfo.styles.background == "dg") color = "#9F9F9F";
          //if(dbInfo.styles.background == "invitebg") color = "#202225";
          //if(dbInfo.styles.background == "banner") color = "#202225";
        };

        const embed = new MessageEmbed()
            .setAuthor(`${infoGuild.name} | ID: ${infoGuild.id}`, infoGuild.iconURL())
            .setColor(color)
            .setThumbnail(infoGuild.iconURL({ format: 'png', dynamic: true}))
            .setFooter(message.author.username, message.author.avatarURL())
            .addField('Owner', infoGuild.owner.user.tag, true)
            .addField(`Created At [${time}]`, `${ca}`, true)
            .addField('\u200b', '\u200b', true)
            .addField(`Last Bumped [${moment(dbInfo.lastbumped).fromNow()}]`, moment(dbInfo.lastbumped).format('LLL'), true)
            .addField('Emojis', infoGuild.emojis.cache.size, true)
            .addField('\u200b', '\u200b', true)
            .addField(`Verification Level [${lvlnum}]`, lvl, true)
            .addField(`Region [${infoGuild.region.toProperCase()}]`, flag, true)
            .addField('\u200b', '\u200b', true)
            .addField(`Members [${infoGuild.memberCount}/${infoGuild.maximumMembers}]`, `🧍 ${infoGuild.members.cache.filter(m => !m.user.bot).size} | 🤖 ${infoGuild.members.cache.filter(m => m.user.bot).size} | <a:serverbooster:768156347036074034> ${infoGuild.premiumSubscriptionCount}`, true)
            .addField(`Channels [${infoGuild.channels.cache.size}]`, `⌨️ ${infoGuild.channels.cache.filter(c => c.type == "text").size} | 🔈 ${infoGuild.channels.cache.filter(c => c.type == "voice").size} | 📁 ${infoGuild.channels.cache.filter(c => c.type == "category").size} | 📢 ${infoGuild.channels.cache.filter(c => c.type == "news").size}`, true)
            .addField('\u200b', '\u200b', true)
            .addField(`Vanity`, dbInfo.vanity.code ? `https://di.scord.xyz/${dbInfo.vanity.code}` : "Not set", true)
            .addField(`Boost Level`, `${infoGuild.premiumTier}`, true)
            // .addField('AFK Channel', `${(infoGuild.afkChannel && infoGuild.afkChannel.name) || "Not Set"}`, true)
            // .addField(`Roles (${infoGuild.roles.cache.size.toLocaleString()})`, roles1

        message.channel.send(embed);
    }
}

module.exports = InfoCMD;
