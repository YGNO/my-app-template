import {
  foreignKey,
  integer,
  pgPolicy,
  pgTable,
  text,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const prefecture = pgTable("prefecture", {
  code: integer().primaryKey().notNull(),
  name: text().notNull(),
  nameKana: text("name_kana").notNull(),
  nameAlpha: text("name_alpha").notNull(),
}, (table) => [
  pgPolicy("prefecture_policy", {
    as: "permissive",
    for: "all",
    to: ["authenticated", "postgres"],
    using: sql`true`,
  }),
]);

export const municipality = pgTable("municipality", {
  prefectureCode: integer("prefecture_code").notNull(),
  code: integer().primaryKey().notNull(),
  name: text().notNull(),
  nameKana: text("name_kana").notNull(),
  nameAlpha: text("name_alpha").notNull(),
}, (table) => [
  foreignKey({
    columns: [table.prefectureCode],
    foreignColumns: [prefecture.code],
    name: "fk_prefecture",
  }).onDelete("cascade"),
  pgPolicy("municipality_policy", {
    as: "permissive",
    for: "all",
    to: ["authenticated", "postgres"],
    using: sql`true`,
  }),
]);
