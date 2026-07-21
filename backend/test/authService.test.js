import { describe, it, expect, beforeEach, vi } from "vitest";
import { login, verifyRouteSecurity, clearSessions, findAdminByEmailAndRole, getSession } from "../src/service/authService.js";

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

describe("findAdminByEmailAndRole", () => {
  it("should successfully find and return a user with matching email and role", async () => {
    const email = "user@health.gov.ph";
    const role = "Administrator (Admin)";
    const result = await findAdminByEmailAndRole(email, role, mockDatabase);

    expect(result).not.toBeNull();
    expect(result.email).toBe(email);
    expect(result.role).toBe(role);
  });

  it("should return null if no user matches the email and role combination", async () => {
    const email = "nonexistent@health.gov.ph";
    const role = "Administrator (Admin)";
    const result = await findAdminByEmailAndRole(email, role, mockDatabase);

    expect(result).toBeNull();
  });
});

describe("login", () => {
  beforeEach(() => {
    clearSessions();
  });

  it("should successfully grant a token and redirect when Admin logs in with valid credentials", async () => {
    const validEmail = "user@health.gov.ph";
    const validRole = "Administrator (Admin)";
    const validPass = "Balayan2026!";

    const result = await login(validEmail, validRole, validPass, mockDatabase);

    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
    expect(result.role).toBe(validRole);
    expect(result.redirectTo).toBe("/masterlist");
  });

  it("should successfully grant a token and redirect when BNS logs in with valid credentials", async () => {
    const validEmail = "bns@health.gov.ph";
    const validRole = "Barangay Nutrition Scholar";
    const validPass = "BNSBalayan2026!";

    const result = await login(validEmail, validRole, validPass, mockDatabase);

    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
    expect(result.role).toBe(validRole);
    expect(result.redirectTo).toBe("/masterlist");
  });

  it("should throw an error and reject login attempts if the password is incorrect", async () => {
    const validEmail = "user@health.gov.ph";
    const validRole = "Administrator (Admin)";
    const invalidPass = "WrongPassword!";

    const resultPromise = login(validEmail, validRole, invalidPass, mockDatabase);

    await expect(resultPromise).rejects.toThrow("Invalid database credentials");
  });

  it("should throw an error if the email does not match the selected role", async () => {
    const validEmail = "user@health.gov.ph";
    const mismatchedRole = "Barangay Nutrition Scholar";
    const validPass = "Balayan2026!";

    const resultPromise = login(validEmail, mismatchedRole, validPass, mockDatabase);

    await expect(resultPromise).rejects.toThrow("Invalid database credentials");
  });
});

describe("verifyRouteSecurity", () => {
  beforeEach(() => {
    clearSessions();
  });

  it("should block attempts to access the masterlist when no token is provided", async () => {
    const nullToken = null;
    const protectedPath = "/masterlist";

    const resultPromise = verifyRouteSecurity(nullToken, protectedPath);

    await expect(resultPromise).rejects.toThrow("Unauthorized access. Redirecting to landing page.");
  });

  it("should permit access to protected views if a valid active session token is supplied", async () => {
    const authSession = await login("user@health.gov.ph", "Administrator (Admin)", "Balayan2026!", mockDatabase);
    const validToken = authSession.token;
    const protectedPath = "/masterlist";

    const result = await verifyRouteSecurity(validToken, protectedPath);

    expect(result.authorized).toBe(true);
    expect(result.status).toBe(200);
  });
});

describe("getSession", () => {
  beforeEach(() => {
    clearSessions();
  });

  it("should return the correct session object for a valid, active token", async () => {
    const authSession = await login("user@health.gov.ph", "Administrator (Admin)", "Balayan2026!", mockDatabase);
    const session = getSession(authSession.token);

    expect(session).not.toBeNull();
    expect(session.email).toBe("user@health.gov.ph");
    expect(session.role).toBe("Administrator (Admin)");
  });

  it("should return null if the token does not exist in the active sessions", () => {
    const session = getSession("nonexistent-token");
    expect(session).toBeNull();
  });
});

describe("clearSessions", () => {
  it("should empty all active session tokens when executed", async () => {
    const authSession = await login("user@health.gov.ph", "Administrator (Admin)", "Balayan2026!", mockDatabase);

    expect(getSession(authSession.token)).not.toBeNull();

    clearSessions();

    expect(getSession(authSession.token)).toBeNull();
  });
});