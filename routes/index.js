const { Router } = require("express");
const moment = require('moment');
const Servers = require("@models/servers");
const { renderTemplate } = require('@structures/middleware');

const route = Router();

const servers = require("@routes/serversroutes");
route.use("/server", servers);

const authroutes = require("@routes/authroutes");
route.use("/", authroutes);

const tagroutes = require("@routes/tagroutes");
route.use("/", tagroutes);

const meroutes = require("@routes/meroutes");
route.use("/me", meroutes);

const apiroutes = require("@routes/apiroutes");
route.use("/api", apiroutes);

route.get('/', async (req, res) => {
  if (req.headers.host == process.env.VANITY_DOMAIN.toString().replace(/(http(s?)):\/\//i, '')) return res.redirect(process.env.DOMAIN);
  let servers = await Servers.find({}, { _id: false })
  servers = servers.filter(server => server.state != "setup");
  let data = {
    servers: servers,
  };
  renderTemplate(res, req, 'index', data);
});

route.get("/join", async (req, res, next) => {
  res.redirect(process.env.GUILD_INVITE);
});

route.get("/terms", async (req, res, next) => {
  renderTemplate(res, req, 'terms');
});
route.get("/partners", async (req, res, next) => {
  renderTemplate(res, req, 'partners');
});
route.get("/privacy", async (req, res, next) => {
  renderTemplate(res, req, 'privacy');
});
route.get("/markdown", async (req, res, next) => {
  renderTemplate(res, req, 'markdown');
});

const vanityroutes = require("@routes/vanity");
route.use("/", vanityroutes);

Array.prototype.shuffle = function () {
  let a = this;
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

module.exports = route;
