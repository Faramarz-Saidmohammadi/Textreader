import { describe, expect, it } from "vitest";
import { can } from "../lib/rbac";

describe("role permissions", () => {
  it("allows owners to manage billing and API keys", () => {
    expect(can("OWNER", "billing:manage")).toBe(true);
    expect(can("OWNER", "apikey:manage")).toBe(true);
  });

  it("allows editors to create content but not manage members", () => {
    expect(can("EDITOR", "phrase:create")).toBe(true);
    expect(can("EDITOR", "member:manage")).toBe(false);
  });

  it("keeps viewers read only", () => {
    expect(can("VIEWER", "phrase:read")).toBe(true);
    expect(can("VIEWER", "phrase:create")).toBe(false);
  });
});
