const mongoose = require("mongoose");

const rebootSchema = new mongoose.Schema({
  channelid: String,
  rebooted: String,
  messageid: String,
  ranuser: String,
});

module.exports = mongoose.model("reboot", rebootSchema);
