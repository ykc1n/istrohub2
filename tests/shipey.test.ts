import assert from "node:assert/strict";
import test from "node:test";
import { getStats, hexToRgb } from "../src/app/shipey/shipey";
import { shipSpecSchema } from "../src/app/shipey/types";

void test("ship stats retain their structured fields and finite weapon totals", () => {
  const stats = getStats({
    name: "Test ship",
    parts: [
      { type: "Mount30", pos: [0, 0], dir: 0 },
      { type: "TorpTurret", pos: [0, 0], dir: 0 },
      { type: "Engine04", pos: [0, -40], dir: 0 },
    ],
    aiRules: [["Field # at start", 1]],
  });
  assert.equal(stats.name, "Test ship");
  assert.equal(stats.weapons.length, 1);
  assert.equal(stats.weapons[0]?.mount, "30 Turret Mount");
  assert.equal(stats.center.length, 2);
  assert.deepEqual(stats.ais, [["Field # at start", 1]]);
  assert.ok(stats.dps > 0);
  for (const value of Object.values(stats)) {
    if (typeof value === "number") assert.ok(Number.isFinite(value));
  }
});

void test("ship parsing rejects malformed positions and preserves extra data", () => {
  assert.throws(() => getStats({ parts: [{ type: "Mount30", pos: [0] }] }));
  const spec = shipSpecSchema.parse({
    parts: [{ type: "Mount30", pos: [0, 0], custom: true }],
    custom: "keep when copying",
  });
  assert.equal(spec.custom, "keep when copying");
  assert.equal(spec.parts[0]?.custom, true);
  assert.deepEqual(spec.aiRules, []);
});

void test("ship colors accept a hash and fall back to white for invalid input", () => {
  assert.deepEqual(hexToRgb("#a1B2c3"), [161, 178, 195]);
  assert.deepEqual(hexToRgb("invalid"), [255, 255, 255]);
});
