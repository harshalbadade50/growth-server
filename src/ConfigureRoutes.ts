import { Router } from "express";

import type { ExpresServerInterface } from "./ExpresServerContext";

import { authenticateToken } from "./middleware/Authenticate";

export class ConfigureRoutes {
  constructor(private context: ExpresServerInterface) {}

  public config() {
    const router = Router();
    router.post(
      "/user/register",
      this.context.userService.registerUser.bind(this.context.userService)
    );

    router.post(
      "/user/login",
      this.context.userService.loginUser.bind(this.context.userService)
    );

    router.get(
      "/user/:username",
      authenticateToken,
      this.context.userService.getUserDetails.bind(this.context.userService)
    );

    return router;
  }
}
