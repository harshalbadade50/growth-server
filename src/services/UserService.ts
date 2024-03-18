import type { NextFunction, Request, Response } from "express";
import type PG from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface User {
  email: string;
  password: string;
}

export const JWT_KEY = "GROWTH_APP_KEY";

export class UserService {
  constructor(private client: PG.Pool) {}

  public async registerUser(req: Request, res: Response, _next: NextFunction) {
    try {
      const { email, password } = req.body as User;
      if (!email || !password) {
        return res
          .status(500)
          .send({ message: "Email or password is undefined!" });
      }
      const userExists = await this.findUser(email);
      if (userExists.rowCount === 1) {
        return res.status(409).send({ message: "User already registered!" });
      }
      const hashedPassword = await this.getHashedPassword(password);
      const result = await this.saveUser({ email, password: hashedPassword });
      if (result.rowCount === 1) {
        return res
          .status(201)
          .send({ message: "User succesfully registered!" });
      } else {
        return res
          .status(500)
          .send({ message: "Registration could not be created" });
      }
    } catch (error) {
      console.log("Error is registering user - ", error);
    }
  }

  public async loginUser(req: Request, res: Response, _next: NextFunction) {
    try {
      const { email, password } = req.body as User;
      const userExists = await this.findUser(email);

      if (userExists.rowCount !== 1) {
        return res
          .status(401)
          .send({ message: "User not registered with us!" });
      }

      const passwordMatch = await bcrypt.compare(
        password,
        userExists.rows[0].password
      );

      if (!passwordMatch) {
        return res
          .status(401)
          .send({ message: "Authentication failed. Wrong credentials!" });
      }

      const token = jwt.sign({ userId: email }, JWT_KEY, {
        expiresIn: "1h",
      });
      return res.status(200).json({ token });
    } catch (error) {
      return res
        .status(401)
        .send({ message: "Error in creating Login - ", error });
    }
  }

  public async getUserDetails(
    req: Request,
    res: Response,
    _next: NextFunction
  ) {
    try {
      const { username } = req.params;
      const result = await this.findUser(username);
      if (result.rowCount !== 0) {
        return res.status(200).send({
          message: `User details are ${JSON.stringify(result.rows[0])}`,
        });
      }
      return res.status(200).send({ message: "User details not found" });
    } catch (error) {
      return res
        .status(404)
        .send({ message: "Error in fetching user details - ", error });
    }
  }

  private async getHashedPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  private async saveUser(user: User) {
    const result = await this.client.query(
      `INSERT INTO users (email, password) VALUES ($1,$2)`,
      [user.email, user.password]
    );
    return result;
  }

  private async findUser(email: string) {
    const result = await this.client.query(
      `SELECT * from users where email=$1`,
      [email]
    );
    return result;
  }
}
