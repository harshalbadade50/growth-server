import PG from "pg";

const { Pool } = PG;

export class PostgresClient {
  constructor() {}

  public configure() {
    const pool = new Pool({
      user: "growth",
      host: "localhost",
      database: "growth",
      password: "growth",
      port: 5432,
    });

    pool.on("error", (error) => {
      console.log(
        "Unexpected error on idle client. Shutting down process: ",
        error
      );
    });

    return pool;
  }
}
