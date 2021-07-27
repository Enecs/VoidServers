const { Router } = require("express");

const Servers = require("@models/servers");
const { renderTemplate } = require("@structures/middleware.js");

const allcategories = ["advertising", "giveaway", "meme", "bots", "developer", "fun", "social", "emotes", "support-server", "music", "stream", "roleplay", "art", "gaming", "economy", "chill", "events", "friends", "teen", "community", "new", "comedy", "youtube", "twitch"];

const route = Router();

route.get("/search", async (req, res, next) => {
  let search = req.query.q;
  if (!search) search = "";
  search = search.toLowerCase();
  let servers = await Servers.find({}, { _id: false });
  let found = servers.filter(server => {
    if (server.state == "setup") return false;
    else if (server.description.toLowerCase().includes(search)) return true;
    else if (server.long.toLowerCase().includes(search)) return true;
    else return false;
  });

  let pg = parseInt(req.query.page);
  if (pg != Math.floor(pg)) pg = 1;
  if (!pg) pg = 1;
  let end = pg * 12;
  let start = pg * 12 - 12;
  const array = [];
  if (found.length === 0) {
    //return res.render('tag/nobots', {category: req.params.category});
  } else if (found.length <= start) {
    //return res.redirect('/tags/');
  } else if (found.length <= end) {
    for (let i = start; i < found.length; i++) {
      array.push(found[i]);
      //console.log(array.join(", "));
    }
  } else {
    for (let i = start; i < end; i++) {
      array.push(found[i]);
    }
  }

  if (!found) return res.send({ error: "No servers found for this search" });
  let data = {
    cards: array,
    search: search,
    page: pg,
    maxpages: Math.ceil(found.length / 12),
  };
  renderTemplate(res, req, "search/search", data);
});

route.get('/tags/', async (req, res, next) => {
  renderTemplate(res, req, "search/alltags", { allcategories })
});

route.get('/tag/:category', async (req, res, next) => {
  if (!allcategories.includes(req.params.category)) return res.redirect('/tags');


  let leaderboard = await Servers.find({ state: "default" }, { _id: false });
  leaderboard = leaderboard.filter(m => m.categories.includes(req.params.category));
  const sorted = leaderboard.sort((a, b) => b.lastbumped - a.lastbumped);

  // if (sorted.length === 0) return res.redirect('/tag/'+req.params.category);

  let pg = parseInt(req.query.page);
  if (pg != Math.floor(pg)) pg = 1;
  if (!pg) pg = 1;
  let end = pg * 12;
  let start = pg * 12 - 12;
  const array = [];
  if (sorted.length === 0) {
    //return res.render('tag/nobots', {category: req.params.category});
  } else if (sorted.length <= start) {
    //return res.redirect('/list/'+req.params.category);
  } else if (sorted.length <= end) {
    for (let i = start; i < sorted.length; i++) {
      array.push(sorted[i]);
      //console.log(array.join(", "));
    }
  } else {
    for (let i = start; i < end; i++) {
      array.push(sorted[i]);
    }
  }

  let data = {
    category: req.params.category,
    categoryformatted: req.params.category.toProperCase(),
    page: pg,
    maxpages: Math.ceil(sorted.length / 12),
    cards: array,
  };
  if (array == []) return res.redirect("/tags");
  renderTemplate(res, req, "search/category", data);
});

route.get('/list/:category', async (req, res, next) => {
  if (!["bumped", "members", "added", "vanity"].includes(req.params.category)) return res.redirect('/tags');


  let leaderboard = await Servers.find({ state: "default" }, { _id: false });
  let sorted = leaderboard.sort((a, b) => b.lastbumped - a.lastbumped);
  if (req.params.category == "members") sorted = leaderboard.sort((a, b) => req.app.get('client').guilds.cache.get(b.guildid).members.cache.size - req.app.get('client').guilds.cache.get(a.guildid).members.cache.size);
  if (req.params.category == "added") sorted = leaderboard.sort((a, b) => b.addedAt - a.addedAt);
  if (req.params.category == "vanity") sorted = leaderboard.filter(m => m.vanity.code).sort((a, b) => b.addedAt - a.addedAt);

  // if (sorted.length === 0) return res.redirect('/tag/'+req.params.category);

  let pg = parseInt(req.query.page);
  if (pg != Math.floor(pg)) pg = 1;
  if (!pg) pg = 1;
  let end = pg * 12;
  let start = pg * 12 - 12;
  const array = [];
  if (sorted.length === 0) {
    //return res.render('tag/nobots', {category: req.params.category});
  } else if (sorted.length <= start) {
    //return res.redirect('/list/'+req.params.category);
  } else if (sorted.length <= end) {
    for (let i = start; i < sorted.length; i++) {
      array.push(sorted[i]);
      //console.log(array.join(", "));
    }
  } else {
    for (let i = start; i < end; i++) {
      array.push(sorted[i]);
    }
  }

  let data = {
    category: req.params.category,
    categoryformatted: req.params.category.toProperCase(),
    page: pg,
    maxpages: Math.ceil(sorted.length / 12),
    cards: array,
  };
  renderTemplate(res, req, "search/list", data);
});

module.exports = route;
