import { ExpressServer } from "./ExpressServer";

import type { ExpresServerInterface } from "./ExpresServerContext";
import { PostgresClient } from "./postgres/PostgresClient";
import { UserService } from "./services/UserService";

export class Application {
  constructor() {}

  public setup() {
    const postgresClient = new PostgresClient().configure();
    const userService = new UserService(postgresClient);

    const services: ExpresServerInterface = {
      userService,
    };

    const expresServer = new ExpressServer(services);
    const server = expresServer.setup();
    return server;
  }
}
