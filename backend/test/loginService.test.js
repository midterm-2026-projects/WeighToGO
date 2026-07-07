import { describe, it, expect, vi } from "vitest";
import { loginService } from "../src/service/loginService.js";
import { loginModel } from "../src/models/loginModel.js";

vi.mock("../src/models/loginModel.js");

describe("Login", () => {
  it("should thrown an error if role is not valid", async () => {
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
    const result = loginService("Administrator (Admin)", "user@health.gov.ph", "Abigail02!");
    await expect(result).rejects.toThrow("Incorrect email or password");
  });
});