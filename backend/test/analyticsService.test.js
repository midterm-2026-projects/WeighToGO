import { describe, it, expect, vi } from "vitest";
import getReports from "../src/service/analyticsService.js";
import childModel from "../src/models/child.model.js";

vi.mock("../src/models/child.model.js");

describe("Filter Queries Integration", () => {

  it("should accurately group, tally, and calculate totals by unique Barangay", async () => {
    const mockDbResponse = [
      { id: 1, barangay: "Barangay 1", wfaStatus: "Normal", hfaStatus: "Normal", wfhlStatus: "Normal" },
      { id: 2, barangay: "Barangay 1", wfaStatus: "Underweight", hfaStatus: "Stunted", wfhlStatus: "Normal" },
      { id: 3, barangay: "Barangay 2", wfaStatus: "Severe Underweight", hfaStatus: "Normal", wfhlStatus: "Wasted" },
      { id: 4, barangay: "Barangay 2", wfaStatus: "Overweight", hfaStatus: "Normal", wfhlStatus: "Normal" }
    ];
    vi.mocked(childModel.getAllChildrenRecords).mockResolvedValue(mockDbResponse);

    const result = await getReports();

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

    const result = await getReports();

    expect(result).toEqual([]);
  });

  it("should ignore and omit child records that do not contain a defined barangay location", async () => {
    const mockDbResponse = [
      { id: 1, barangay: "Barangay 1", wfaStatus: "Normal", hfaStatus: "Normal", wfhlStatus: "Normal" },
      { id: 2, barangay: null, wfaStatus: "Underweight", hfaStatus: "Normal", wfhlStatus: "Normal" },
      { id: 3, barangay: undefined, wfaStatus: "Normal", hfaStatus: "Stunted", wfhlStatus: "Normal" }
    ];
    vi.mocked(childModel.getAllChildrenRecords).mockResolvedValue(mockDbResponse);

    const result = await getReports();

    expect(result.length).toBe(1);

    const brgy1 = result.find(r => r.barangay === "Barangay 1");
    expect(brgy1.totalRegistered).toBe(1);
    expect(brgy1.normal).toBe(1);
  });
});