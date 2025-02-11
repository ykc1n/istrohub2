import { pgTable, bigint, text, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const ships = pgTable("ships", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "ships_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	name: text().notNull(),
	shipey: text(),
	stats: jsonb(),
	shipeyJson: jsonb("shipey_json"),
});
