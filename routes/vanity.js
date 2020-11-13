const { Router } = require("express");
const moment = require('moment');
const Servers = require("@models/servers");
const { renderTemplate } = require('@structures/middleware');

const route = Router();

route.get('/:vanity', async (req, res, next) => {
    if(req.headers.host == process.env.DOMAIN.toString().replace(/(http(s?)):\/\//i, '')) return next();
    const vanityuri = req.params.vanity;

    let server = await Servers.findOne({ "vanity.code": vanityuri }, { _id: false })
    if(!server) return res.redirect(process.env.DOMAIN)
    if(server.vanity.action == "join") {
      return res.redirect(process.env.DOMAIN + "/server/" + server.guildid + "/join")
    }

    res.redirect(process.env.DOMAIN + "/server/" + server.guildid)
});

Array.prototype.shuffle = function () {
    let a = this;
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

module.exports = route;
