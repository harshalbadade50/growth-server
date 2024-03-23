import { Router } from "express";

import type { ExpresServerInterface } from "./ExpresServerContext";

import { authenticateToken } from "./middleware/Authenticate";

export class ConfigureRoutes {
  constructor(private context: ExpresServerInterface) {}

  public config() {
    const router = Router();

    router.get("/hello", (_req, res, _next) => {
      console.log("into the hello request");
      return res.status(200).send({
        message: "You have reached the server. And it's healthy!",
      });
    });

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
