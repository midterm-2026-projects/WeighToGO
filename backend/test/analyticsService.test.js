import { describe, it, expect, beforeEach, vi } from "vitest";
import getReports from "../src/service/analyticsService.js";
import { login, clearSessions } from "../src/service/authService.js";
import childModel from "../src/models/child.model.js";

vi.mock("../src/models/child.model.js");

const mockDatabase = [
  {
    id: 1,
    role: "Administrator (Admin)",
    email: "user@health.gov.ph",
    password: "Balayan2026!"
  },
  {
    id: 2,
    role: "Barangay Nutrition Scholar",
    email: "bns@health.gov.ph",
    password: "BNSBalayan2026!",
    assignedBarangay: "Barangay 2"
  }
];

describe("Filter Queries Integration", () => {
  let adminToken;

  beforeEach(async () => {
    clearSessions();
    const authSession = await login("user@health.gov.ph", "Administrator (Admin)", "Balayan2026!", mockDatabase);
    adminToken = authSession.token;
  });

  it("should accurately group, tally, and calculate totals by unique Barangay", async () => {
    const mockDbResponse = [
      { id: 1, barangay: "Barangay 1", wfaStatus: "Normal", hfaStatus: "Normal", wfhlStatus: "Normal" },
      { id: 2, barangay: "Barangay 1", wfaStatus: "Underweight", hfaStatus: "Stunted", wfhlStatus: "Normal" },
      { id: 3, barangay: "Barangay 2", wfaStatus: "Severe Underweight", hfaStatus: "Normal", wfhlStatus: "Wasted" },
      { id: 4, barangay: "Barangay 2", wfaStatus: "Overweight", hfaStatus: "Normal", wfhlStatus: "Normal" }
    ];
    vi.mocked(childModel.getAllChildrenRecords).mockResolvedValue(mockDbResponse);

    const result = await getReports(adminToken);

    expect(result.length).toBe(2);

    const brgy1 = result.find(r => r.barangay === "Barangay 1");
    expect(brgy1.totalRegistered).toBe(2);
    expect(brgy1.normal).toBe(1);
    expect(brgy1.underweight).toBe(1);
    expect(brgy1.stunted).toBe(1);
    expect(brgy1.wasted).toBe(0);
    expect(brgy1.obese).toBe(0);

    const brgy2 = result.find(r => r.barangay === "Barangay 2");
    expect(brgy2.totalRegistered).toBe(2);
    expect(brgy2.normal).toBe(0);
    expect(brgy2.underweight).toBe(1);
    expect(brgy2.stunted).toBe(0);
    expect(brgy2.wasted).toBe(1);
    expect(brgy2.obese).toBe(1);
  });

  it("should return an empty collection gracefully if there are no database records", async () => {
    vi.mocked(childModel.getAllChildrenRecords).mockResolvedValue([]);

    const result = await getReports(adminToken);

    expect(result).toEqual([]);
  });

  it("should ignore and omit child records that do not contain a defined barangay location", async () => {
    const mockDbResponse = [
      { id: 1, barangay: "Barangay 1", wfaStatus: "Normal", hfaStatus: "Normal", wfhlStatus: "Normal" },
      { id: 2, barangay: null, wfaStatus: "Underweight", hfaStatus: "Normal", wfhlStatus: "Normal" },
      { id: 3, barangay: undefined, wfaStatus: "Normal", hfaStatus: "Stunted", wfhlStatus: "Normal" }
    ];
    vi.mocked(childModel.getAllChildrenRecords).mockResolvedValue(mockDbResponse);

    const result = await getReports(adminToken);

    expect(result.length).toBe(1);

    const brgy1 = result.find(r => r.barangay === "Barangay 1");
    expect(brgy1.totalRegistered).toBe(1);
    expect(brgy1.normal).toBe(1);
  });
});

describe("Role-Based Health Reports Database Integration Controls", () => {
  beforeEach(() => {
    clearSessions();
  });

  it("should restrict Barangay Nutrition Scholar to retrieve only their assigned barangay reports", async () => {
    const mockDbResponse = [
      { id: 1, barangay: "Barangay 1", wfaStatus: "Normal", hfaStatus: "Normal", wfhlStatus: "Normal" },
      { id: 2, barangay: "Barangay 2", wfaStatus: "Underweight", hfaStatus: "Normal", wfhlStatus: "Normal" }
    ];
    vi.mocked(childModel.getAllChildrenRecords).mockResolvedValue(mockDbResponse);

    const authSession = await login("bns@health.gov.ph", "Barangay Nutrition Scholar", "BNSBalayan2026!", mockDatabase);
    const result = await getReports(authSession.token);

    expect(result.length).toBe(1);
    expect(result[0].barangay).toBe("Barangay 2");
    expect(result.find(r => r.barangay === "Barangay 1")).toBeUndefined();
  });

  it("should block database query operations if session token is missing or invalid", async () => {
    const invalidToken = "fake-expired-token";

    const resultPromise = getReports(invalidToken);

    await expect(resultPromise).rejects.toThrow("Unauthorized: Invalid or missing session token");
  });
});