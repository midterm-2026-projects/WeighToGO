import { expect, it, describe } from "vitest";
import { Login } from "../components/W1D1/Login.jsx";

describe("Weigh To Go Portal - Login Logic Validation (Strict AAA)", () => {
  const adminRole = "Administrator (Admin)";
  const bnsRole = "Barangay Nutrition Scholar";
  const validAdminEmail = "user@health.gov.ph";
  const validAdminPassword = "Balayan2026!";

  it("should return success message if the Administrator role, email, and password are correct", () => {
    const role = adminRole;
    const email = validAdminEmail;
    const password = validAdminPassword;

    const result = Login(role, email, password);

    expect(result).toMatch("Login Successful");
  });

  it("should return success message if the Barangay Nutrition Scholar role, email, and password are correct", () => {
    const role = bnsRole;
    const email = "bns@health.gov.ph";
    const password = "BNSBalayan2026!";

    const result = Login(role, email, password);

    expect(result).toMatch("Login Successful");
  });

  it("should throw an error if dropdown role selection is empty", () => {
    const emptyRole = "";
    let capturedError;

    try {
      Login(emptyRole, validAdminEmail, validAdminPassword);
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeDefined();
    expect(capturedError.message).toBe("Invalid dropdown selection");
  });

  it("should throw an error if an unlisted role values injects into the system", () => {
    const invalidRole = "Municipal Health Officer";
    let capturedError;

    try {
      Login(invalidRole, validAdminEmail, validAdminPassword);
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeDefined();
    expect(capturedError.message).toBe("Invalid dropdown selection");
  });

  it("should throw an error if email does not contain @", () => {
    const brokenEmail = "userhealth.gov.ph";
    let capturedError;

    try {
      Login(adminRole, brokenEmail, validAdminPassword);
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeDefined();
    expect(capturedError.message).toBe("Invalid email format");
  });

  it("should throw an error if email does not have a domain name", () => {
    const brokenEmail = "user@";
    let capturedError;

    try {
      Login(adminRole, brokenEmail, validAdminPassword);
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeDefined();
    expect(capturedError.message).toBe("Invalid email format");
  });

  it("should throw an error if email field is empty", () => {
    const emptyEmail = "";
    let capturedError;

    try {
      Login(adminRole, emptyEmail, validAdminPassword);
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeDefined();
    expect(capturedError.message).toBe("Invalid email format");
  });

  it("should throw an error if password length is under 8 characters", () => {
    const shortPassword = "short";
    let capturedError;

    try {
      Login(adminRole, validAdminEmail, shortPassword);
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeDefined();
    expect(capturedError.message).toBe("Weak password configuration");
  });

  it("should throw an error if password field is empty", () => {
    const emptyPassword = "";
    let capturedError;

    try {
      Login(adminRole, validAdminEmail, emptyPassword);
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeDefined();
    expect(capturedError.message).toBe("Weak password configuration");
  });

  it("should return warning message when email does not match database records", () => {
    const incorrectEmail = "different-user@health.gov.ph";

    const result = Login(adminRole, incorrectEmail, validAdminPassword);

    expect(result).toEqual("Incorrect email or password");
  });

  it("should return warning message when password does not match database records", () => {
    const incorrectPassword = "WrongPassword123";

    const result = Login(adminRole, validAdminEmail, incorrectPassword);

    expect(result).toEqual("Incorrect email or password");
  });
});