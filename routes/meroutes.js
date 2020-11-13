const { Router } = require("express");

const Servers = require("@models/servers");
const { addUser } = require("@structures/discordApi");
const { renderTemplate } = require("@structures/middleware.js");
const { Permissions } = require('discord.js');

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

module.exports = route;
