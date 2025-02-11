
import { create } from "domain";
import { sql } from "drizzle-orm";
import {
  text,
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  pgTable,
  jsonb
} from "drizzle-orm/pg-core";


//export const createTable = pgTableCreator( (name) => name)

export const ships = pgTable(
    "ships",{
        id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
        name: text("name"),
        shipey: text("shipey"),
        stats: jsonb("stats"),
        shipey_json: jsonb("shipey_json")
    }
)