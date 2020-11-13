const mongoose = require("mongoose");

const serversSchema = new mongoose.Schema({
  addedAt: {
    default: () => new Date(),
    type: Date
  },
  guildid: {
    type: String,
    required: true,
    unique: true
  },
  invite: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  long: {
    type: String,
    required: true
  },
  state:  {
    type: String,
    default: "setup"
  },
  lastbumped: {
    default: () => new Date(),
    type: Date,
  },
  nsfw: {
    type: Boolean,
    default: false
  },
  categories: {
	  type: Array,
	  default: [],
  },
  password: {
    type: String,
  },
  vanity: {
    code: { type: String, default: null },
    action: { type: String, default: null },
  },
  styles: {
    background: { type: String, default: "default" },
  }
});

module.exports = mongoose.model("servers", serversSchema);
