import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { env } from "./config.js";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle({ client: pool });

await migrate(db, { migrationsFolder: "./drizzle/migrations" });
