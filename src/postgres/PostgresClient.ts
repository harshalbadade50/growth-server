import PG from "pg";
import base64 from "base-64";
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
    const port = process.env.PG_PORT ? Number(process.env.PGPORT) : 5432;
    console.log(
      "Database connection string - ",
      process.env.INSTANCE_CONNECTION_NAME
    );

    if (process.env.INSTANCE_CONNECTION_NAME) {
      const DB_USER = Buffer.from(process.env.DB_USER || '', 'base64').toString('utf-8');
      const DB_PASS = Buffer.from(process.env.DB_PASS || '', 'base64').toString('utf-8');
      const DB_NAME = Buffer.from(process.env.DB_NAME || '', 'base64').toString('utf-8');
      console.log('DB_USER from secret - ', DB_USER)
      console.log('DB_PASS from secret - ', DB_PASS)
      console.log('DB_NAME from secret - ', DB_NAME)

      const dbUser = 'quickstartuser' //base64.decode(process.env.DB_USER!);
      const dbPass = 'postgresdb' //base64.decode(process.env.DB_PASS!);
      const dbName = 'quickstartdb' //base64.decode(process.env.DB_NAME!);

      console.log(
        "before connector.getOptions is called -- ",
        dbUser,
        dbPass,
        dbName
      );

      const connector = new Connector();
      const clientOpts = await connector.getOptions({
        instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME!,
        ipType: IpAddressTypes.PUBLIC,
      });
      console.log("after connector.getOptions is called");

      const dbConfig = {
        //client: "pg",
        // connection: {
        //   ...clientOpts,
        //   user: process.env.DB_USER || "growth_user",
        //   password: process.env.DB_PASS || "growth_user_pwd",
        //   database: process.env.DB_NAME || "growth_db",
        // },
        ...clientOpts,
        user: dbUser || "growth_user",
        password: dbPass || "growth_user_pwd",
        database: dbName || "growth_db",
      };

      return dbConfig;
    }

    return {
      user: process.env.PGUSER || "growth",
      host: process.env.PGHOST || "localhost",
      database: process.env.PGDATABASE || "growth",
      password: process.env.PGPASSWORD || "growth",
      port,
    };
  }
}
