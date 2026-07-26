import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
  path: ".env.local",
  override: true,
});

const databaseUrl = process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL_DIRECT ou DATABASE_URL não foi definida no .env.local.");
}

export default defineConfig({
  schema: "./src/db/schema/**/*.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
  verbose: true,
});
