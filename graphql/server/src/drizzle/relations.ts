import { relations } from "drizzle-orm/relations";
import { prefecture, municipality } from "./schema";

export const municipalityRelations = relations(municipality, ({one}) => ({
	prefecture: one(prefecture, {
		fields: [municipality.prefectureCode],
		references: [prefecture.code]
	}),
}));

export const prefectureRelations = relations(prefecture, ({many}) => ({
	municipalities: many(municipality),
}));