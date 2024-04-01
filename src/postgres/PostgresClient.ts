import PG from "pg";
import { Connector, IpAddressTypes } from "@google-cloud/cloud-sql-connector";

const { Pool } = PG;

export class PostgresClient {
  constructor() {}

  public async configure() {
    //const { user, host, database, password, port } = this.getConfiguration();
    const dbConfig = await this.getConfiguration();
    console.log("DB cloud sql credentials are ---> ", dbConfig);
    // const pool = new Pool({
    //   user,
    //   host,
    //   database,
    //   password,
    //   port,
    // });
    const pool: PG.Pool = new Pool(dbConfig);

    pool.on("error", (error) => {
      console.log(
        "Unexpected error on idle client. Shutting down process: ",
        error
      );
    });

    return pool as PG.Pool;
  }

  private async getConfiguration(): Promise<PG.PoolConfig> {
    //const port = process.env.PG_PORT ? Number(process.env.PGPORT) : 5432;
    console.log(
      "INSTANCE_CONNECTION_NAME is - ",
      process.env.INSTANCE_CONNECTION_NAME
    );

    const connector = new Connector();
    const clientOpts = await connector.getOptions({
      instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME!,
      ipType: IpAddressTypes.PRIVATE,
    });
    const dbConfig = {
      //client: "pg",
      // connection: {
      //   ...clientOpts,
      //   user: process.env.DB_USER || "growth_user",
      //   password: process.env.DB_PASS || "growth_user_pwd",
      //   database: process.env.DB_NAME || "growth_db",
      // },
      ...clientOpts,
      user: process.env.DB_USER || "growth_user",
      password: process.env.DB_PASS || "growth_user_pwd",
      database: process.env.DB_NAME || "growth_db",
    };

    return dbConfig;
    // return {
    //   user: process.env.PGUSER || "growth",
    //   host: process.env.PGHOST || "localhost",
    //   database: process.env.PGDATABASE || "growth",
    //   password: process.env.PGPASSWORD || "growth",
    //   port,
    // };
  }
}
