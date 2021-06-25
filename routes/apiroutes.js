const { Router } = require("express");

const Servers = require("@models/servers");
const moment = require('moment');

const route = Router();

route.get('/server/:id', async (req, res) => {
  let server = await Servers.findOne({ guildid: req.params.id }, { _id: false })
  if(!server) return res.json({ code: 404, error: "Server does not exist" });

  res.json({ code: 200, server });
});

route.post('/run/', async (req, res) => {
  // Route is for debugging issues.
  try {
    let e = eval(req.body.code);
    res.json({ code: 200, evaled: e });
  } catch (err) {
    res.json({ code: 400, error: err.message });
  }
});

module.exports = route;
