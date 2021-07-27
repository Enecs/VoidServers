const path = require("path");
const express = require("express");
const cookieParser = require('cookie-parser')

const getFilesSync = require("@structures/fileWalk");
const { renderTemplate } = require('@structures/middleware');

class App {
  constructor(client) {
    this.express = express();
    this.express.set('views', './dynamic');
    this.express.set('view engine', 'ejs');
    this.express.set('client', client);
    this.express.use(cookieParser());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(express.static(__dirname + "/../public"));

    this.loadRoutes().loadErrorHandler().loadNotFound();
  }

  listen(port) {
    return new Promise((resolve) => this.express.listen(port, resolve));
  }


  loadRoutes() {
    const routesPath = path.join(__dirname, "../routes");
    const routes = getFilesSync(routesPath);

    if (!routes.length) return this;

    routes.forEach((filename) => {
      const route = require(path.join(routesPath, filename));

      const routePath = filename === "index.js" ? "/" : `/${filename.slice(0, -3)}`;

      try {
        this.express.use(routePath, route);
      } catch (error) {
        console.error(`Error occured with the route "${filename}"\n\n${error}`);
      }
    });

    return this;
  }


  loadErrorHandler() {
    this.express.use(async (error, _req, res, _next) => {
      const { message, statusCode = 500 } = error;

      if (statusCode >= 500) {
        console.error(error);
        let data = {
          message: message,
          status: statusCode,
          error
        };
        return renderTemplate(res, _req, "errors/express", data);
      }
      return res.json(error);
    });

    return this;
  }

  loadNotFound() {
    this.express.use(async (_req, res, _next) => {
      renderTemplate(res, _req, 'errors/404');
    });
  }
}

module.exports = App;
