import type { UserService } from "./services/UserService";

export interface ExpresServerInterface {
  userService: UserService;
}
