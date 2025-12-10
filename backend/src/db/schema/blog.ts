import { pgTable, integer, varchar, timestamp } from "drizzle-orm/pg-core";

export const blogs = pgTable("blogs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  content: varchar("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
