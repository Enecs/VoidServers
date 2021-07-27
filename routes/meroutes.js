const { Router } = require("express");

const Servers = require("@models/servers");
const { renderTemplate } = require("@structures/middleware.js");
const { getUser } = require("@structures/discordApi");

const route = Router();

route.get('/', async (req, res) => {
  res.redirect('/me/servers')
})

route.get('/servers', async (req, res) => {
  let servers = await Servers.find({}, { _id: false })
  servers = servers.filter(server => server.state != "deleted");

  let data = {
    servers: servers
  };
  renderTemplate(res, req, 'me/servers', data);
});

route.get('/settings', async (req, res) => {
  renderTemplate(res, req, 'me/settings');
});

route.get('/add', async (req, res) => {
  res.render('me/add');
});

route.get('/admin', async (req, res) => {
  let user;
  let { refresh_token, access_token } = req.cookies;
  if (!refresh_token) {
    res.cookie("backURL", req.originalUrl);
    return res.redirect('/login');
  }

  let result = await getUser({ access_token, refresh_token });
  if (!result) return res.redirect("/login");
  [user, { refresh_token, access_token }] = result;

  if (!process.env.ADMIN_USERS.includes(user.id)) return renderTemplate(res, req, 'errors/403');

  let servers = await Servers.find({}, { _id: false });
  servers = servers.filter(server => server.state != "deleted");

  let data = {
    cards: servers
  };
  renderTemplate(res, req, 'me/admin', data);
});

module.exports = route;
