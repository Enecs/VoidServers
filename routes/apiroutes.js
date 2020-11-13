const { Router } = require("express");

const Servers = require("@models/servers");
const moment = require('moment');

const route = Router();

/*
route.get('/server/:id', async (req, res) => {
    //const { key } = req.headers;
    //if(key !== "Errrrr") return res.json({ code: 403, error: "Access Forbidden" });

    let server = await Servers.findOne({ guildid: req.params.id }, { _id: false })
    if(!server) return res.json({ code: 404, error: "Server does not exist" });

    res.json({ code: 200, flastbumped: moment(server.lastbumped).fromNow() });
});*/

module.exports = route;
