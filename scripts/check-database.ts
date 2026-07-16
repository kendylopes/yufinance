import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({
  path: ".env.local",
});

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL não foi definida no arquivo .env.local.");
}

const sql = neon(databaseUrl);

async function checkDatabase(): Promise<void> {
  const result = await sql`
    select
      current_database() as database_name,
      current_user as database_user,
      now() as server_time
  `;

  const connection = result[0];

  if (!connection) {
    throw new Error("O banco não retornou informações da conexão.");
  }

  console.log("Conexão com o PostgreSQL estabelecida.");
  console.log({
    databaseName: connection.database_name,
    databaseUser: connection.database_user,
    serverTime: connection.server_time,
  });
}

checkDatabase().catch((error: unknown) => {
  console.error("Falha na conexão com o PostgreSQL.");

  if (error instanceof Error) {
    console.error(error.message);
  }

  process.exitCode = 1;
});
