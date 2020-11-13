const { isRegExp } = require("util");

class Settings {
  constructor(client, database, modal) {
    this.client = client;
    this.database = database;
    this.modal = modal;
  }

  /**
   * Gets the stored data of a guild
   * @param {String} guildID
   */
  async get() {
    const guilddata = await this.modal.findOne({}, { _id: false })
    if(guilddata) {
      return guilddata;
    } else {
      return new Error('No data could be found.');
    }
  }

  /**
   * Sets the stored data of a guild
   * @param {String} guildID
   * @param {*} data
   */
  async set(guildID, data) {
    const guilddb = await this.modal.findOne({}, { _id: false });
    if(!guilddb){
      return await new this.modal(data).save();
    }else{
      return new Error('Data already exists.');
    }
  }

  /**
   * Deletes the data of a guild
   * @param {String} guildID
   */
  async delete() {
    return await this.modal.findOneAndDelete({})
  }

  async update(data) {
    return await this.modal.updateOne({}, {$set: data })
  }

  async ensure() {
    const guilddb = await this.modal.findOne({}, { _id: false });
    if(!guilddb){
      let data = {
        rebooted: false
      };
      await new this.modal(data).save()
      return true;
    }else{
      return false;
    }
  }
}

module.exports = Settings;
