
import { create } from "domain";
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  pgTable
} from "drizzle-orm/pg-core";


//export const createTable = pgTableCreator( (name) => name)

export const ships = pgTable(
    "ships",{
        id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
        name: varchar("name"),
        shipey: varchar("shipey") 
    }


)