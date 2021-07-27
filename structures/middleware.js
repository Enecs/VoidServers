const path = require('path');
const templateDir = path.resolve(`${process.cwd()}${path.sep}dynamic`);
const { getUser } = require("@structures/discordApi");

module.exports.renderTemplate = async (res, req, template, data = {}) => {
  if(!res.render) return console.error('TypeError: res was not defined');
  if(!req.cookies) return console.error('TypeError: req was not defined');


  // Setup user variable
  let user = null;
  let {refresh_token, access_token} = req.cookies;
  if (refresh_token) {
    let result = await getUser({access_token, refresh_token});
    if (!result) return res.redirect("/login");
    [user, {refresh_token, access_token}, userguilds] = result;
    res.cookie("refresh_token", refresh_token, {httpOnly: true});
    res.cookie("access_token", access_token, {httpOnly: true});
  }

  if(user != null) user.isAdmin = process.env.ADMIN_USERS.includes(user.id);

  const baseData = {
    bot: req.app.get('client'),
    path: req.path,
    user: user,
  };
  res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
};
