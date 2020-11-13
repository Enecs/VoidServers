const { Router } = require("express");

const Servers = require("@models/servers");
const { getUser, addUser } = require("@structures/discordApi");

const route = Router();

route.get("/login", async (req, res, next) => {
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&scope=identify%20guilds%20guilds.join&prompt=none&redirect_uri=${encodeURIComponent(process.env.DOMAIN)}/callback`)
});

route.get("/callback", async (req, res, next) => {
    if (!req.query.code) {
        if (req.cookies.backURL) {
          const url = decodeURIComponent(req.cookies.backURL);
          res.clearCookie("backURL");
          return res.redirect(url);
        } else {
          return res.redirect('/');
        }
    }
    const code = req.query.code;
    const result = await getUser({code});
    if (!result) return res.redirect('/login');
    const [{ username, discriminator, avatar, id }, {refresh_token, access_token}] = result;
    res.cookie("refresh_token", refresh_token, {httpOnly: true})
    res.cookie("access_token", access_token, {httpOnly: true})
	// await addUser({client: req.app.get('client'), accessToken: access_token, userId: id}).catch(err => console.error(err));
    req.app.get('client').users.fetch(id);
	if (req.cookies.backURL) {
      const url = decodeURIComponent(req.cookies.backURL);
      res.clearCookie("backURL");
      res.redirect(url);
    } else {
      res.redirect('/');
    }
});

route.get("/logout", async (req, res, next) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.redirect(`/?ref=logout`);
});

module.exports = route;
