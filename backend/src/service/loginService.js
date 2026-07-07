import { findAdminByEmailAndRole } from "../models/loginModel.js";

export async function loginService(role, email, password) {
  const validRoles = ["Administrator (Admin)", "Barangay Nutrition Scholar"];

  const fail = (message) => {
    throw new Error(message);
  };

  if (!role || !validRoles.includes(role)) {
    fail("Invalid dropdown selection");
  }

  if (!email || !email.includes("@") || email.endsWith("@")) {
    fail("Invalid email format");
  }

  if (!password || password.length < 8) {
    fail("Weak password configuration");
  }

  const matchedUser = await findAdminByEmailAndRole(email, role);

  if (!matchedUser || matchedUser.password !== password) {
    fail("Incorrect email or password");
  }

  return matchedUser;
}