import { login, verifyRouteSecurity, findAdminByEmailAndRole } from "./authService.js";

const VALID_ROLES = ["Administrator (Admin)", "Barangay Nutrition Scholar"];
const VALID_SIDENAV_ROUTES = ["/masterlist", "/health-reports"];

export async function loginService(role, email, password) {
  if (!role || !VALID_ROLES.includes(role)) throw new Error("Invalid dropdown selection");
  if (!email || !email.includes("@") || email.endsWith("@")) throw new Error("Invalid email format");
  if (!password || password.length < 8) throw new Error("Weak password configuration");

  const matchedUser = await findAdminByEmailAndRole(email, role);
  if (!matchedUser || matchedUser.password !== password) throw new Error("Incorrect email or password");

  return matchedUser;
}

export async function executeUserAuthJourney(email, role, password) {
  if (!email || !role || !password) throw new Error("Missing authentication parameters");
  if (!VALID_ROLES.includes(role)) throw new Error("Invalid user role specified for auth journey");

  const result = await login(email, role, password, []);
  return {
    authenticated: true,
    token: result.token,
    assignedRole: result.role,
    targetView: result.redirectTo
  };
}

export async function verifySidenavRouting(token, route) {
  if (!token) throw new Error("Session token is required for Sidenav navigation");
  if (!VALID_SIDENAV_ROUTES.includes(route)) throw new Error("Invalid sidebar navigation target");

  const result = await verifyRouteSecurity(token, route);
  return {
    route: route,
    navigated: result.authorized,
    statusCode: result.status
  };
}
