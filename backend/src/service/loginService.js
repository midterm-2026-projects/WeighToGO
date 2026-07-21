import { login, verifyRouteSecurity, findAdminByEmailAndRole } from "./authService.js";

const VALID_ROLES = ["Administrator (Admin)", "Barangay Nutrition Scholar"];
const VALID_SIDENAV_ROUTES = ["/masterlist", "/health-reports"];

  if (!role || !validRoles.includes(role)) throw new Error("Invalid dropdown selection");
  if (!email || !email.includes("@") || email.endsWith("@")) throw new Error("Invalid email format");
  if (!password || password.length < 8) throw new Error("Weak password configuration");

  const matchedUser = await findAdminByEmailAndRole(email, role);
  if (!matchedUser || matchedUser.password !== password) throw new Error("Incorrect email or password");

  return matchedUser;
}
