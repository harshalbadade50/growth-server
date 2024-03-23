import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import type { Express } from "express";

import { ConfigureRoutes } from "./ConfigureRoutes";
import type { ExpresServerInterface } from "./ExpresServerContext";

export class ExpressServer {
  private server?: Express;

  constructor(private context: ExpresServerInterface) {}

  public setup() {
    this.server = express();
    this.configureMiddlewares(this.server);
    const routes = new ConfigureRoutes(this.context).config();

    this.server.use("/", routes);
    console.log("Routes configured");
    return this.server;
  }

  public configureMiddlewares(server: Express) {
    server.use(bodyParser.json());
    server.use(
      session({
        secret: "growth-app-session",
        resave: true,
        saveUninitialized: false,
        name: "growthSession",
      })
    );
  }
}
