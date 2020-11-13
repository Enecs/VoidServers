'use strict';
/**
 * This class creates the command properties to be used
 */
class Event {
  /**
   * Available properties for the command
   * @param {Object} client - Bots client object
   * @param {String} name - Name of the command
   * @param {String} description - Description of the command
   * @param {Boolean} enabled - Is command enabled
   */
  constructor(client, {
    name = 'not provided',
    enabled = false,
  }) {
    this.client = client;
    this.conf = { name, enabled };
  }
}
module.exports = Event;
