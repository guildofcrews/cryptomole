import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function runMigration() {
  console.log("Running page_views migration...");
  
  // Run statements separately since DO blocks don't work in transactions
  const statements = [
    `DO $$ BEGIN CREATE TYPE "device_type" AS ENUM('desktop', 'mobile', 'tablet'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
    `CREATE TABLE IF NOT EXISTS "page_views" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "view_date" date NOT NULL,
      "path" text NOT NULL,
      "visitor_hash" varchar(64) NOT NULL,
      "referrer_host" text,
      "device_type" "device_type" DEFAULT 'desktop' NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS "page_views_view_date_idx" ON "page_views" ("view_date")`,
    `CREATE INDEX IF NOT EXISTS "page_views_path_idx" ON "page_views" ("path")`,
    `CREATE INDEX IF NOT EXISTS "page_views_visitor_hash_idx" ON "page_views" ("visitor_hash")`
  ];
  
  for (const stmt of statements) {
    try {
      await sql.unsafe(stmt);
      console.log("✓ Executed statement");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "OK";
      console.log("Statement result:", msg);
    }
  }
  
  console.log("\nVerifying table...");
  
  // Verify table exists
  const result = await sql`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'page_views'
  `;
  console.log("Table exists:", result.length > 0);
  
  // Check columns
  const columns = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'page_views'
    ORDER BY ordinal_position
  `;
  console.log("Columns:", columns.map((c) => c.column_name as string).join(", "));
  
  // Check row count
  const count = await sql`SELECT COUNT(*) as count FROM page_views`;
  console.log("Current row count:", count[0].count);
}

runMigration().catch(console.error);
