import { ExpressServer } from "./ExpressServer.js";

import type { ExpresServerInterface } from "./ExpresServerContext.js";
import { PostgresClient } from "./postgres/PostgresClient.js";
import { UserService } from "./services/UserService.js";

export class Application {
  constructor() {}

  public async setup() {
    const postgresClient = await new PostgresClient().configure();
    const userService = new UserService(postgresClient);

    const services: ExpresServerInterface = {
      userService,
    };

    const expresServer = new ExpressServer(services);
    const server = expresServer.setup();
    console.log("Setup done here");
    return server;
  }
}
