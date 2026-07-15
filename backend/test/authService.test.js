import { describe, it, expect, beforeEach, vi } from "vitest";
import { login, verifyRouteSecurity, clearSessions } from "../src/service/authService.js";
import getReports from "../src/service/analyticsService.js";
import childModel from "../src/models/child.model.js";

vi.mock("../src/models/child.model.js");

describe("Authentication", () => {
  beforeEach(() => {
    clearSessions();
  });

  it("should successfully grant a token and redirect when Admin logs in with valid credentials", async () => {
    const validEmail = "user@health.gov.ph";
    const validRole = "Administrator (Admin)";
    const validPass = "Balayan2026!";

    const result = await login(validEmail, validRole, validPass);

    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
    expect(result.role).toBe(validRole);
    expect(result.redirectTo).toBe("/masterlist");
  });

  it("should successfully grant a token and redirect when BNS logs in with valid credentials", async () => {
    const validEmail = "bns@health.gov.ph";
    const validRole = "Barangay Nutrition Scholar";
    const validPass = "BNSBalayan2026!";

    const result = await login(validEmail, validRole, validPass);

    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
    expect(result.role).toBe(validRole);
    expect(result.redirectTo).toBe("/masterlist");
  });

  it("should throw an error and reject login attempts if the password is incorrect", async () => {
    const validEmail = "user@health.gov.ph";
    const validRole = "Administrator (Admin)";
    const invalidPass = "WrongPassword!";

    const resultPromise = login(validEmail, validRole, invalidPass);

    await expect(resultPromise).rejects.toThrow("Invalid database credentials");
  });

  it("should throw an error if the email does not match the selected role", async () => {
    const validEmail = "user@health.gov.ph";
    const mismatchedRole = "Barangay Nutrition Scholar";
    const validPass = "Balayan2026!";

    const resultPromise = login(validEmail, mismatchedRole, validPass);

    await expect(resultPromise).rejects.toThrow("Invalid database credentials");
  });

  it("should block attempts to access the masterlist when no token is provided", async () => {
    const nullToken = null;
    const protectedPath = "/masterlist";

    const resultPromise = verifyRouteSecurity(nullToken, protectedPath);

    await expect(resultPromise).rejects.toThrow("Unauthorized access. Redirecting to landing page.");
  });

  it("should permit access to protected views if a valid active session token is supplied", async () => {
    const authSession = await login("user@health.gov.ph", "Administrator (Admin)", "Balayan2026!");
    const validToken = authSession.token;
    const protectedPath = "/masterlist";

    const result = await verifyRouteSecurity(validToken, protectedPath);

    expect(result.authorized).toBe(true);
    expect(result.status).toBe(200);
  });
});

describe("Role-Based Health Reports Database Integration", () => {
  beforeEach(() => {
    clearSessions();
  });

  it("should permit Administrator to query and aggregate metrics for all barangays", async () => {
    const mockDbResponse = [
      { id: 1, barangay: "Barangay 1", wfaStatus: "Normal", hfaStatus: "Normal", wfhlStatus: "Normal" },
      { id: 2, barangay: "Barangay 2", wfaStatus: "Underweight", hfaStatus: "Normal", wfhlStatus: "Normal" }
    ];
    vi.mocked(childModel.getAllChildrenRecords).mockResolvedValue(mockDbResponse);

    const authSession = await login("user@health.gov.ph", "Administrator (Admin)", "Balayan2026!");
    const result = await getReports(authSession.token);

    expect(result.length).toBe(2);
    expect(result.find(r => r.barangay === "Barangay 1")).toBeDefined();
    expect(result.find(r => r.barangay === "Barangay 2")).toBeDefined();
  });

  it("should restrict Barangay Nutrition Scholar to retrieve only their assigned barangay reports", async () => {
    const mockDbResponse = [
      { id: 1, barangay: "Barangay 1", wfaStatus: "Normal", hfaStatus: "Normal", wfhlStatus: "Normal" },
      { id: 2, barangay: "Barangay 2", wfaStatus: "Underweight", hfaStatus: "Normal", wfhlStatus: "Normal" }
    ];
    vi.mocked(childModel.getAllChildrenRecords).mockResolvedValue(mockDbResponse);

    const authSession = await login("bns@health.gov.ph", "Barangay Nutrition Scholar", "BNSBalayan2026!");
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