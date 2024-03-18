import PG from "pg";

const { Pool } = PG;

export class PostgresClient {
  constructor() {}

  public configure() {
    const { user, host, database, password, port } = this.getConfiguration();
    console.log(
      "DB connection creds ---> ",
      user,
      host,
      database,
      password,
      port
    );
    const pool = new Pool({
      user,
      host,
      database,
      password,
      port,
    });

    pool.on("error", (error) => {
      console.log(
        "Unexpected error on idle client. Shutting down process: ",
        error
      );
    });

    return pool;
  }

  private getConfiguration() {
    const port = process.env.PG_PORT ? Number(process.env.PGPORT) : 5432;
    return {
      user: process.env.PGUSER || "growth",
      host: process.env.PGHOST || "localhost",
      database: process.env.PGDATABASE || "growth",
      password: process.env.PGPASSWORD || "growth",
      port,
    };
  }
}
