const { Router } = require("express");
const Servers = require("@models/servers");

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

module.exports = route;
