import { z } from "zod";

export const shipSpecSchema = z.object({
  name: z.string().default(""),
  parts: z.array(z.object({
    type: z.string(),
    pos: z.tuple([z.number(), z.number()]),
    dir: z.number().default(0),
  }).passthrough()),
  aiRules: z.array(z.tuple([z.string()]).rest(z.unknown())).default([]),
}).passthrough();

export type ShipSpec = z.infer<typeof shipSpecSchema>;
export type Weapon = {
  type: string;
  name: string;
  pos: [number, number];
  mount?: string;
  arc?: number;
} & Record<"damage" | "dps" | "energyDamage" | "range" | "reloadTime" |
  "bulletSpeed" | "shotEnergy" | "fireEnergy" | "weaponRange" |
  "weaponRangeFlat" | "weaponDamage" | "weaponSpeed" | "weaponReload" | "weaponEnergy", number>;

export type NumericStats = Record<"hp" | "cost" | "mass" | "thrust" | "turnSpeed" |
  "genEnergy" | "storeEnergy" | "shield" | "genShield" | "jumpCount" |
  "radius" | "dps" | "damage" | "range" | "moveEnergy" | "fireEnergy" |
  "otherEnergy" | "allEnergy" | "speed" | "jumpDistance", number>;
export type ShipStats = NumericStats & {
  name: string;
  center: [number, number];
  weapons: Weapon[];
  ais: ShipSpec["aiRules"];
};

export type SelectedShip = {
  id: number;
  name: string;
  img: string;
  stats: ShipStats;
  parts: ShipSpec;
  color: string;
  statsToCompare: Partial<ShipStats>;
};
