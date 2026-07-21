import { findAdminByEmailAndRole } from "../models/loginModel.js";

export async function loginService(role, email, password) {
  const validRoles = ["Administrator (Admin)", "Barangay Nutrition Scholar"];

  if (!role || !validRoles.includes(role)) throw new Error("Invalid dropdown selection");
  if (!email || !email.includes("@") || email.endsWith("@")) throw new Error("Invalid email format");
  if (!password || password.length < 8) throw new Error("Weak password configuration");

  const matchedUser = await findAdminByEmailAndRole(email, role);
  if (!matchedUser || matchedUser.password !== password) throw new Error("Incorrect email or password");

  return matchedUser;
}
