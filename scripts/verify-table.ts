import { db, pageViews } from "../src/db";
import { sql } from "drizzle-orm";

async function verify() {
  console.log("Checking page_views table...");
  
  try {
    // Try to count rows
    const result = await db.select({ count: sql<number>`count(*)` }).from(pageViews);
    console.log("✓ Table exists! Row count:", result[0].count);
    
    // Get column info via raw query
    const columns = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'page_views'
      ORDER BY ordinal_position
    `);
    console.log("Columns:", columns.rows.map((c) => c.column_name as string).join(", "));
    
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Error:", msg);
  }
}

verify();
