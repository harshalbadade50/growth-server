import type { UserService } from "./services/UserService.js";

export interface ExpresServerInterface {
  userService: UserService;
}
