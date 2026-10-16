import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "approved",
  "rejected",
]);

export const sourceTypeEnum = pgEnum("source_type", [
  "x",
  "inbox",
  "blog",
  "call",
  "announcement",
  "other",
]);

export const coins = pgTable("coins", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  ticker: text("ticker").notNull(),
  description: text("description"),
  website: text("website"),
  xHandle: text("x_handle"),
  discordUrl: text("discord_url"),
  telegramUrl: text("telegram_url"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  coinId: uuid("coin_id")
    .notNull()
    .references(() => coins.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  summary: text("summary"),
  body: text("body"),
  sourceType: sourceTypeEnum("source_type").notNull().default("other"),
  sourceUrl: text("source_url"),
  publishedAt: timestamp("published_at"),
  status: postStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const coinsRelations = relations(coins, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  coin: one(coins, {
    fields: [posts.coinId],
    references: [coins.id],
  }),
}));

export type Coin = typeof coins.$inferSelect;
export type NewCoin = typeof coins.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
