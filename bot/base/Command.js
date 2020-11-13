class Command {

  constructor (client, {
    name = null,
    description = "No description provided.",
    category = "Uncategorized",
    usage = "No usage provided.",
    enabled = true,
    guildOnly = false,
    aliases = [],
    permLevel = "User",
    cooldown = 0,
  }) {
    this.client = client;
    this.conf = { enabled, guildOnly, aliases, permLevel, cooldown };
    this.help = { name, description, category, usage };
  }
}
module.exports = Command;
