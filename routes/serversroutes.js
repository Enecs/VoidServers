const { Router } = require("express");

const Servers = require("@models/servers");
const moment = require('moment');
const { getUser } = require('@structures/discordApi');
const { renderTemplate } = require("@structures/middleware.js");
const md = require('markdown-it')({
  breaks: true
});

const route = Router();

route.get('/:id', async (req, res, next) => {
  let user;
  let { refresh_token, access_token } = req.cookies;
  if (refresh_token) {
    let result = await getUser({ access_token, refresh_token });
    if (!result) return res.redirect("/login");
    [user, { refresh_token, access_token }] = result;
  }

  let server = await Servers.findOne({ guildid: req.params.id }, { _id: false })
  if (!server) return renderTemplate(res, req, "servers/404");
  if (server.state === "deleted") return renderTemplate(res, req, "servers/404");

  const guild = req.app.get('client').guilds.cache.get(req.params.id);

  var desc = `This server's description was corrupted, most likely due to an image.`;
  if (server.long != null) desc = md.render(server.long);
  server.long = desc;

  let isManaged = false;
  if (user != null) {
    isManaged = guild && !!guild.member(user.id) ? guild.member(user.id).permissions.has('MANAGE_GUILD') : false;
    if (process.env.ADMIN_USERS.includes(user.id)) isManaged = true;
  }

  let data = {
    server,
    guild,
    moment,
    isManaged,
  };
  renderTemplate(res, req, "servers/view", data);
});

route.get("/:id/edit", async (req, res, next) => {
  let user;
  let { refresh_token, access_token } = req.cookies;
  if (!refresh_token) {
    res.cookie("backURL", req.originalUrl);
    return res.redirect('/login');
  }

  let result = await getUser({ access_token, refresh_token });
  if (!result) return res.redirect("/login");
  [user, { refresh_token, access_token }] = result;

  let server = await Servers.findOne({ guildid: req.params.id }, { _id: false })
  if (!server) return renderTemplate(res, req, "servers/404");

  const guild = req.app.get('client').guilds.cache.get(req.params.id);
  const isManaged = guild && !!guild.member(user.id) ? guild.member(user.id).permissions.has('MANAGE_GUILD') : false;
  if (!isManaged && !process.env.ADMIN_USERS.includes(user.id)) return renderTemplate(res, req, 'errors/403');

  const categories = ["advertising", "giveaway", "meme", "bots", "developer", "fun", "social", "emotes", "support-server", "music", "stream", "roleplay", "art", "gaming", "economy", "chill", "events", "friends", "teen", "community", "new", "comedy", "youtube", "twitch"]

  renderTemplate(res, req, "servers/edit", { server: server, guild: guild, categories });
});

route.post("/:id/edit", async (req, res, next) => {
  let user;
  let { refresh_token, access_token } = req.cookies;
  if (!refresh_token) return res.status(403).json({ code: "NO_PERMISSION", message: "You do not have permission to access this." });

  let result = await getUser({ access_token, refresh_token });
  if (!result) return res.status(403).json({ code: "NO_PERMISSION", message: "You do not have permission to access this." });
  [user, { refresh_token, access_token }] = result;

  let server = await Servers.findOne({ guildid: req.params.id }, { _id: false })
  if (!server) return res.status(404).json({ code: "NOT_FOUND", message: "The server you tried to access was non-existant. Please check the url and try again." });

  const guild = req.app.get('client').guilds.cache.get(req.params.id);
  const isManaged = guild && !!guild.member(user.id) ? guild.member(user.id).permissions.has('MANAGE_GUILD') : false;
  if (!isManaged && !process.env.ADMIN_USERS.includes(user.id)) return res.status(403).json({ code: "NO_PERMISSION", message: "You do not have permission to access this." });
  const body = req.body;
  if (Object.keys(body).length == 0) return res.status(400).json({ code: "EMPTY_RESPONSE", message: "No data received. The server closed the connection without receiving any data." });


  if (body.vanityURL && body.vanityAction) {
    let servervenity = await Servers.findOne({ "vanity.code": body.vanityURL }, { _id: false })
    if (servervenity != null) return res.status(409).json({ code: "CONFLICT", message: "The selected vanity code already exists for another server. Please select another one, and try again." });
    await Servers.updateOne({ guildid: server.guildid }, { $set: { vanity: { code: body.vanityURL, action: body.vanityAction } } })
    return res.status(201).json({ message: "Successfully updated your vanity settings!", code: "SUCCESS", redirect: `/server/${req.params.id}/?type=edited` });
  }
  if (body.shortdesc && body.longdesc && body.invitelink) {
    const tags = body.tags || [];
    await Servers.updateOne({ guildid: server.guildid }, { $set: { state: "default", description: body.shortdesc, long: body.longdesc, invite: body.invitelink, categories: tags, styles: { background: body.backgroundStyle } } })
    return res.status(201).json({ message: "Successfully updated your server settings!", code: "SUCCESS", redirect: `/server/${req.params.id}/?type=edited` });
  }
  if (!body.shortdesc || !body.longdesc || !body.invitelink || !body.vanityURL || !body.vanityAction || !body.backgroundStyle) {
    res.status(400).json({ message: "One or more fields are missing.", code: "EMPTY_RESPONSE" });
  }

  res.status(400).json({ message: "An unexpected error occurred.", code: "UNEXPECTED_ERR" });
});

route.get("/:id/join", async (req, res, next) => {
  let user;
  let { refresh_token, access_token } = req.cookies;
  if (refresh_token) {
    let result = await getUser({ access_token, refresh_token });
    if (!result) return res.redirect("/login");
    [user, { refresh_token, access_token }] = result;
  }

  let server = await Servers.findOne({ guildid: req.params.id }, { _id: false })
  if (!server) return renderTemplate(res, req, "servers/404");

  const guild = req.app.get('client').guilds.cache.get(req.params.id);

  renderTemplate(res, req, "servers/join", { server: server, guild: guild });
});

route.get("/:id/bump", async (req, res, next) => {
  let user;
  let { refresh_token, access_token } = req.cookies;
  if (!refresh_token) {
    res.cookie("backURL", req.originalUrl);
    return res.redirect('/login');
  }

  let result = await getUser({ access_token, refresh_token });
  if (!result) return res.redirect("/login");
  [user, { refresh_token, access_token }] = result;

  let server = await Servers.findOne({ guildid: req.params.id }, { _id: false })
  if (!server) return res.sendStatus(404);
  const guild = req.app.get('client').guilds.cache.get(req.params.id);
  renderTemplate(res, req, "servers/bump", { server: server, guild: guild });
});

route.post('/:id/bump', async (req, res, next) => {
  let user;
  let { refresh_token, access_token } = req.cookies;
  if (!refresh_token) { res.cookie("backURL", req.originalUrl); return res.redirect("/login"); }

  let result = await getUser({ access_token, refresh_token });
  if (!result) return res.redirect("/login");
  [user, { refresh_token, access_token }] = result;

  let server = await Servers.findOne({ guildid: req.params.id }, { _id: false })
  if (!server) return renderTemplate(res, req, "servers/404");

  const timeremain = getTimeRemaining(server.lastbumped)
  if (timeremain.days == 0) {
    if (timeremain.hours < 2) return res.redirect(`/server/${server.guildid}/?type=cooldown`);
  }
  await Servers.updateOne({ guildid: server.guildid }, { $set: { lastbumped: new Date(Date.parse(new Date())) } })
  res.redirect(`/server/${server.guildid}/?type=success`)
});

route.get("/:id/delete", async (req, res, next) => {
  let user;
  let { refresh_token, access_token } = req.cookies;
  if (!refresh_token) {
    res.cookie("backURL", req.originalUrl);
    return res.redirect('/login');
  }

  let result = await getUser({ access_token, refresh_token });
  if (!result) return res.redirect("/login");
  [user, { refresh_token, access_token }] = result;

  let server = await Servers.findOne({ guildid: req.params.id }, { _id: false })
  if (!server) return renderTemplate(res, req, "servers/404");

  const guild = req.app.get('client').guilds.cache.get(req.params.id);
  const isManaged = guild && guild.ownerID === user.id ? true : false;
  if (!isManaged && !process.env.ADMIN_USERS.includes(user.id)) return renderTemplate(res, req, 'errors/403');

  await Servers.findOneAndDelete({ guildid: guild.id });
  await guild.leave();

  res.redirect(`/me/servers?deleted=${guild.id}`);
});

function getTimeRemaining(endtime) {
  const total = Date.parse(new Date()) - Date.parse(endtime);
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
}

module.exports = route;
