import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

// CLI/migrate commands use DIRECT_URL (Supabase's direct, non-pooled
// connection) — DDL over a pgbouncer pooled connection is unreliable. The
// app itself connects via DATABASE_URL (pooled) through the adapter in
// lib/prisma.ts.
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: env("DIRECT_URL"),
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
