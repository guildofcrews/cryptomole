import { pgTable, text, timestamp, uuid, pgEnum, primaryKey, date, varchar } from "drizzle-orm/pg-core";
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

export const coinClassEnum = pgEnum("coin_class", [
  "project",
  "macro",
  "macro+project",
  "issuer",
]);

export const VALID_TOPICS = ["regulation", "etf", "legislation", "stablecoin-reg"] as const;
export type PostTopic = (typeof VALID_TOPICS)[number];

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
  coingeckoId: text("coingecko_id"),
  coinClass: coinClassEnum("coin_class").default("project"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subcategories = pgTable("subcategories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const coinCategories = pgTable(
  "coin_categories",
  {
    coinId: uuid("coin_id")
      .notNull()
      .references(() => coins.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.coinId, t.categoryId] })]
);

export const coinSubcategories = pgTable(
  "coin_subcategories",
  {
    coinId: uuid("coin_id")
      .notNull()
      .references(() => coins.id, { onDelete: "cascade" }),
    subcategoryId: uuid("subcategory_id")
      .notNull()
      .references(() => subcategories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.coinId, t.subcategoryId] })]
);

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
  topics: text("topics").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const postCoins = pgTable(
  "post_coins",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    coinId: uuid("coin_id")
      .notNull()
      .references(() => coins.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.coinId] })]
);

export const coinsRelations = relations(coins, ({ many }) => ({
  posts: many(posts),
  coinCategories: many(coinCategories),
  coinSubcategories: many(coinSubcategories),
  postCoins: many(postCoins),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
  coinCategories: many(coinCategories),
}));

export const subcategoriesRelations = relations(subcategories, ({ one, many }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
  coinSubcategories: many(coinSubcategories),
}));

export const coinCategoriesRelations = relations(coinCategories, ({ one }) => ({
  coin: one(coins, {
    fields: [coinCategories.coinId],
    references: [coins.id],
  }),
  category: one(categories, {
    fields: [coinCategories.categoryId],
    references: [categories.id],
  }),
}));

export const coinSubcategoriesRelations = relations(coinSubcategories, ({ one }) => ({
  coin: one(coins, {
    fields: [coinSubcategories.coinId],
    references: [coins.id],
  }),
  subcategory: one(subcategories, {
    fields: [coinSubcategories.subcategoryId],
    references: [subcategories.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  coin: one(coins, {
    fields: [posts.coinId],
    references: [coins.id],
  }),
  postCoins: many(postCoins),
}));

export const postCoinsRelations = relations(postCoins, ({ one }) => ({
  post: one(posts, {
    fields: [postCoins.postId],
    references: [posts.id],
  }),
  coin: one(coins, {
    fields: [postCoins.coinId],
    references: [coins.id],
  }),
}));

// Device type enum for analytics
export const deviceTypeEnum = pgEnum("device_type", [
  "desktop",
  "mobile",
  "tablet",
]);

// Page views table for first-party analytics
// Visitor hash is a daily-salted SHA-256 of IP + UA (never stores raw IPs)
export const pageViews = pgTable("page_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  viewDate: date("view_date").notNull(),
  path: text("path").notNull(),
  visitorHash: varchar("visitor_hash", { length: 64 }).notNull(),
  referrerHost: text("referrer_host"),
  deviceType: deviceTypeEnum("device_type").notNull().default("desktop"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Coin = typeof coins.$inferSelect;
export type NewCoin = typeof coins.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Subcategory = typeof subcategories.$inferSelect;
export type NewSubcategory = typeof subcategories.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type PostCoin = typeof postCoins.$inferSelect;
export type NewPostCoin = typeof postCoins.$inferInsert;
export type CoinClass = typeof coinClassEnum.enumValues[number];
export type PageView = typeof pageViews.$inferSelect;
export type NewPageView = typeof pageViews.$inferInsert;
export type DeviceType = typeof deviceTypeEnum.enumValues[number];
