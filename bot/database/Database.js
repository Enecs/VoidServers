const mongoose = require('mongoose');
const classes = require('./classes');

/**
 * The Database used by the client
 */
class Database {
  /**
   * This creates the database functions
   * @param {*} client
   * @property fn
   */
  constructor(client) {
    this.client = client;
    //this.modals = {};

    // get the files from classes and assign them.
    for (const i in classes) {
      this[i.toLowerCase()] = new classes[i](this.client, this, require(`@models/${i.toLowerCase()}.js`));
      //Object.assign(this[i.toLowerCase()], { fn: new classes[i](this.client, this), modal: require(`./models/${i.toLowerCase()}.js`) })
      //Object.assign(this.models, { [i.toLowerCase()]: require(`./models/${i.toLowerCase()}.js`) });
    }
  }
}

module.exports = Database;
