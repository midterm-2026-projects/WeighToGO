import { describe, it, expect, vi } from "vitest";
import { filterChildMasterlist } from "../src/service/childService.js";
import * as childModel from "../src/models/childModel.js";

vi.mock("../src/models/childModel.js");

describe("Masterlist Filter", () => {

  it("should throw an error if the selected Barangay is not on the masterlist configuration", async () => {
    const invalidBarangay = "Brgy. NonExistent";
    const defaultAge = "All";
    const defaultStatus = "All";

    const result = filterChildMasterlist(invalidBarangay, defaultAge, defaultStatus);

    await expect(result).rejects.toThrow("Invalid Barangay selection");
  });

  it("should throw an error if the selected nutritional status option is invalid", async () => {
    const validBarangay = "Brgy. Navotas";
    const defaultAge = "All";
    const invalidStatus = "Severe";

    const result = filterChildMasterlist(validBarangay, defaultAge, invalidStatus);

    await expect(result).rejects.toThrow("Invalid Nutritional Status selection");
  });

  it("should throw an error if the age group value format selection does not exist", async () => {
    const defaultBarangay = "All";
    const invalidAgeGroup = "60+ Months";
    const defaultStatus = "All";

    const result = filterChildMasterlist(defaultBarangay, invalidAgeGroup, defaultStatus);

    await expect(result).rejects.toThrow("Invalid Nutritional Age Group selection");
  });
});