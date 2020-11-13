'use strict';
const klaw = require("klaw");
const path = require("path");
const { promisify } = require('util');
const { Client, Collection } = require("discord.js");
const Database = require('@bot/database/Database.js');

class VoidBot extends Client {
  constructor(options) {
    super(options);

    this.perms = require('@bot/base/Level'); // Danno's PermLevel Methods.
    this.database = new Database(this);
    this.logger = require('@bot/base/Logger');

    // Create the Collections
    this.commands = new Collection();
    this.aliases = new Collection();
    this.events = new Collection();

    // Debug option
    this.DEBUG = false;

    // Load Commands/Events
    this.loadCommands('./bot/commands');
    this.loadEvents('./bot/events');

    // Basically just an async shortcut to using a setTimeout. Nothing fancy!
    this.wait = promisify(setTimeout); // Used in ready event
  }

   /**
    * PERMISSION LEVEL FUNCTION
    *
    * This is a very basic permission system for commands which uses "levels"
    * "spaces" are intentionally left black so you can add them if you want.
    * NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
    * command including the VERY DANGEROUS `eval` command!
    * @param {*} message The Message
    * @returns {number}
    */
   permLevel(message) {
    let permlvl = 0;

    const permOrder = this.perms.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }

  getPerm(member) {
    let permlvl = 0;

    const permOrder = this.perms.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (member.guild && currentLevel.guildOnly) continue;
      if (currentLevel.checkMember(member)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }

  randomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Loads the commands folder.
   *
   * @param {*} folder the relative path to the commands folder, i suggest keeping it in the default location 'data/commands'.
   */
  loadCommands(folder) {
    klaw(folder).on('data', (file) => {
      const commandFile = path.parse(file.path);
      if (!commandFile.ext || commandFile.ext !== '.js') return;

      const response = this.loadCommand(commandFile.dir, `${commandFile.name}${commandFile.ext}`);

      if (response) this.logger.log(response, "error");
    });
  }


  /**
   * LOAD COMMAND
   *
   * Used to simplify loading commands from multiple locations
   * @param {String} cmdPath
   * @param {String} cmdName
   */
  loadCommand(cmdPath, cmdName) {
    try {
      const props = new (require(path.resolve(cmdPath, cmdName)))(this);

      if (!props.conf.enabled) return;

      props.conf.location = cmdPath;
      props.conf.fileName = cmdName;

      if (props.init) {
        props.init(this);
      }

      this.commands.set(props.help.name, props);

      props.conf.aliases.forEach((alias) => {
        this.aliases.set(alias, props.help.name);
      });

      if (this.DEBUG === true) this.logger.log(`${cmdName} Loaded`, 'debug');
      return false;
    } catch (error) {
      return `Unable to load command ${cmdName}: ${error.message}`;
    }
  }

  /**
   * UNLOAD COMMAND
   *
   * Used to simplify unloads commands from multiple locations
   * @param {String} cmdPath
   * @param {String} cmdName
   */
  async unloadCommand(cmdPath, cmdName) {
    let command;
    if (this.commands.has(cmdName)) {
      command = this.commands.get(cmdName);
    } else if (this.aliases.has(cmdName)) {
      command = this.commands.get(this.aliases.get(cmdName));
    } else {
      return `The command '${cmdName}' doesn't exist, it's not an alias either.`;
    }

    if (command.shutdown) {
      await command.shutdown(this);
    }

    delete require.cache[require.resolve(path.resolve(cmdPath, command.conf.fileName))];
    return false;
  }

  /**
   * Loads the events folder.
   *
   * @param {*} folder the relative path to the events folder, i suggest keeping it in the default location 'data/events'.
   */
  loadEvents(folder) {
    klaw(folder).on('data', (file) => {
      const eventFile = path.parse(file.path);
      if (!eventFile.ext || eventFile.ext !== '.js') return;

      const response = this.loadEvent(eventFile.dir, `${eventFile.name}${eventFile.ext}`);

      if (response) this.logger.log(response, "error");
    });
  }

  /**
   * LOAD EVENT
   *
   * Used to simplify loading events from multiple locations
   * @param {String} evtPath
   * @param {String} evtName
   */
  loadEvent(evtPath, evtName) {
    try {
      const props = new (require(path.resolve(evtPath, evtName)))(this);
      if (props.conf.enabled === false) return;
      props.conf.location = evtPath;
      props.conf.fileName = evtName;
      if (props.init) {
        props.init(this);
      }

      this.events.set(props.conf.name, props);

      this.on(props.conf.name, (...args) => props.run(this, ...args));

      if (this.DEBUG === true) this.logger.log(`${evtName} Loaded`, 'debug');
      return false;
    } catch (error) {
      return `Unable to load event ${evtName}: ${error.message}`;
    }
  }

  /**
   * UNLOAD EVENT
   *
   * Used to simplify unloads events from multiple locations
   * @param {String} evtPath
   * @param {String} evtName
   */
  async unloadEvent(evtPath, evtName) {
    let event;
    if (this.events.has(evtName)) {
      event = this.events.get(evtName);
    } else {
      return `The event '${evtName}' doesn't exist`;
    }

    if (event.shutdown) {
      await event.shutdown(this);
    }

    delete require.cache[require.resolve(path.resolve(evtPath, event.conf.fileName))];
    return false;
  }

  reloadEvent(evtPath, evtName) {
    try {
      const props = new (require(path.resolve(evtPath, evtName)))(this);

      if (props.conf.enabled === false) return;

      props.conf.location = evtPath;
      props.conf.fileName = evtName;

      if (props.init) {
        props.init(this);
      }

      this.events.set(props.conf.name, props);

      if (this.DEBUG === true) this.logger.log(`${evtName} Loaded`, 'debug');
      return false;
    } catch (error) {
      return `Unable to load event ${evtName}: ${error.message}`;
    }
  }
}

module.exports = VoidBot;
