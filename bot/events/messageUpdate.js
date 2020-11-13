const Event = require('@bot/base/Event.js');

module.exports = class extends Event {
    constructor (client) {
      super(client, {
        name: 'messageUpdate',
        enabled: true,
      })
    }

    async run (client, oldMessage, newMessage) {
      // Cancel if nothing changed. (Text not changing? Accidential fire?)
      if(oldMessage == newMessage || oldMessage.content == newMessage.content) return;
      client.emit('message', newMessage);
    }
}
