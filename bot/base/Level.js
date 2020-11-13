/* eslint-disable max-len */
'use strict';

/**
 * PERMISSION LEVELS
 ** 0  =  non-roled users
 ** 1  =  Trial Moderator
 ** 2  =  Moderator
 ** 3  =  Bot Approver
 ** 4  =  Trial Manager
 ** 5  =  Manager
 ** 6  =  Blank
 ** 7  =  Blank
 ** 8  =  Blank
 ** 9  =  Site Admin
 ** 10 =  Bot Owner
 */
const permLevels = [
  // Level 0 ~ Everyone has access
  {
    level: 0,
    name: 'User',
    check: () => true,
    checkMember: () => true,
  },

  // Level 1 ~ Trial Moderator or higher has access
  {
    level: 1,
    name: 'Trial Moderator',
    check: (message) => {
      const role = message.client.guilds.cache.get(process.env.GUILD_ID).roles.cache.get(process.env.TRIALMODERATOR_ROLE);
      if (!role) return false;
      try {
        const trialmodRole = message.client.guilds.cache.get(process.env.GUILD_ID).roles.cache.get(process.env.TRIALMODERATOR_ROLE);
        return trialmodRole && message.client.guilds.cache.get(process.env.GUILD_ID).members.cache.get(message.member.id).roles.cache.has(trialmodRole.id);
      } catch (e) {
        return false;
      }
    },
    checkMember: (member) => {
      const role = member.client.guilds.cache.get(process.env.GUILD_ID).roles.cache.get(process.env.TRIALMODERATOR_ROLE);
      if (!role) return false;
      try {
        const trialmodRole = member.client.guilds.cache.get(process.env.GUILD_ID).roles.cache.get(process.env.TRIALMODERATOR_ROLE);
        return trialmodRole && member.client.guilds.cache.get(process.env.GUILD_ID).members.cache.get(member.id).roles.cache.has(trialmodRole.id);
      } catch (e) {
        return false;
      }
    },
  },

  // Level 2 ~ Moderator or higher has access
  {
    level: 2,
    name: 'Moderator',
    check: (message) => {
      const role = message.client.guilds.cache.get(process.env.GUILD_ID).roles.cache.get(process.env.MODERATOR_ROLE);
      if (!role) return false;
      try {
        const modRole = message.client.guilds.cache.get(process.env.GUILD_ID).roles.cache.get(process.env.MODERATOR_ROLE);
        return modRole && message.client.guilds.cache.get(process.env.GUILD_ID).members.cache.get(message.member.id).roles.cache.has(modRole.id);
      } catch (e) {
        return false;
      }
    },
    checkMember: (member) => {
      const role = member.client.guilds.cache.get(process.env.GUILD_ID).roles.cache.get(process.env.MODERATOR_ROLE);
      if (!role) return false;
      try {
        const modRole = member.client.guilds.cache.get(process.env.GUILD_ID).roles.cache.get(process.env.MODERATOR_ROLE);
        return modRole && member.client.guilds.cache.get(process.env.GUILD_ID).members.cache.get(member.id).roles.cache.has(modRole.id);
      } catch (e) {
        return false;
      }
    },
  },

  // Level 10 ~ Site Admin or higher has access
  {
    level: 10,
    name: 'Site Admin',
    check: (message) => process.env.ADMIN_USERS.split(' ').includes(message.author.id),
    checkMember: (member) => process.env.ADMIN_USERS.split(' ').includes(member.id),
  },
];

module.exports = permLevels;
