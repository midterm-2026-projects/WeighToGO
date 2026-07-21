import { describe, it, expect, beforeEach, vi } from "vitest";
import { loginService, executeUserAuthJourney, verifySidenavRouting } from "../src/service/loginService.js";
import { login, verifyRouteSecurity, findAdminByEmailAndRole } from "../src/service/authService.js";

vi.mock("../src/service/authService.js", () => ({
  login: vi.fn(),
  verifyRouteSecurity: vi.fn(),
  findAdminByEmailAndRole: vi.fn()
}));

describe("loginService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw an error if role is not valid", async () => {
    const result = loginService("WrongRole", "user@health.gov.ph", "Balayan2026!");
    await expect(result).rejects.toThrow("Invalid dropdown selection");
  });

  it("should throw an error if the email does not have (@) symbol", async () => {
    const result = loginService("Administrator (Admin)", "userhealth.gov.ph", "Balayan2026!");
    await expect(result).rejects.toThrow("Invalid email format");
  });

  it("should throw an error if the password input is too short", async () => {
    const result = loginService("Administrator (Admin)", "user@health.gov.ph", "abi");
    await expect(result).rejects.toThrow("Weak password configuration");
  });

  it("should throw an error if wrong login credentials are used", async () => {
    findAdminByEmailAndRole.mockResolvedValueOnce(null);

    const result = loginService("Administrator (Admin)", "user@health.gov.ph", "Abigail02!");
    await expect(result).rejects.toThrow("Incorrect email or password");
  });
});

describe("executeUserAuthJourney", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully automate login, bypass the landing page, and direct an Administrator to the masterlist", async () => {
    login.mockResolvedValueOnce({
      success: true,
      token: "mock-jwt-token-admin",
      role: "Administrator (Admin)",
      redirectTo: "/masterlist"
    });

    const result = await executeUserAuthJourney("user@health.gov.ph", "Administrator (Admin)", "Balayan2026!");

    expect(login).toHaveBeenCalledWith("user@health.gov.ph", "Administrator (Admin)", "Balayan2026!", []);
    expect(result.authenticated).toBe(true);
    expect(result.token).toBe("mock-jwt-token-admin");
    expect(result.assignedRole).toBe("Administrator (Admin)");
    expect(result.targetView).toBe("/masterlist");
  });

  it("should throw an error if required credentials are incomplete during the automated journey", async () => {
    const result = executeUserAuthJourney("user@health.gov.ph", "Administrator (Admin)", null);
    await expect(result).rejects.toThrow("Missing authentication parameters");
  });

  it("should throw an error when authenticating with invalid credentials", async () => {
    login.mockRejectedValueOnce(new Error("Invalid database credentials"));

    const result = executeUserAuthJourney("user@health.gov.ph", "Administrator (Admin)", "WrongPassword!");
    await expect(result).rejects.toThrow("Invalid database credentials");
  });

  it("should throw an error when an unauthorized user role attempts authentication", async () => {
    const result = executeUserAuthJourney("guest@health.gov.ph", "Unauthorized Role", "Guest123!");
    await expect(result).rejects.toThrow("Invalid user role specified for auth journey");
  });
});

describe("verifySidenavRouting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should navigate smoothly to the Masterlist view using sidebar route verification", async () => {
    verifyRouteSecurity.mockResolvedValueOnce({
      authorized: true,
      status: 200
    });

    const result = await verifySidenavRouting("valid-token-123", "/masterlist");

    expect(verifyRouteSecurity).toHaveBeenCalledWith("valid-token-123", "/masterlist");
    expect(result.route).toBe("/masterlist");
    expect(result.navigated).toBe(true);
    expect(result.statusCode).toBe(200);
  });

  it("should navigate smoothly to the Health Reports view using sidebar route verification", async () => {
    verifyRouteSecurity.mockResolvedValueOnce({
      authorized: true,
      status: 200
    });

    const result = await verifySidenavRouting("valid-token-123", "/health-reports");

    expect(verifyRouteSecurity).toHaveBeenCalledWith("valid-token-123", "/health-reports");
    expect(result.route).toBe("/health-reports");
    expect(result.navigated).toBe(true);
    expect(result.statusCode).toBe(200);
  });

  it("should throw an error if no session token is provided during sidebar navigation", async () => {
    const result = verifySidenavRouting(null, "/masterlist");
    await expect(result).rejects.toThrow("Session token is required for Sidenav navigation");
  });

  it("should throw an error if attempting to navigate to an unregistered sidebar target", async () => {
    const result = verifySidenavRouting("valid-token-123", "/unauthorized-settings");
    await expect(result).rejects.toThrow("Invalid sidebar navigation target");
  });
});