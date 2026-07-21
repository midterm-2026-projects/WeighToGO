import { login, verifyRouteSecurity, findAdminByEmailAndRole } from "./authService.js";

const VALID_ROLES = ["Administrator (Admin)", "Barangay Nutrition Scholar"];
const VALID_SIDENAV_ROUTES = ["/masterlist", "/health-reports"];

export async function loginService(role, email, password, database = []) {
  const fail = (message) => {
    throw new Error(message);
  };

  if (!role || !VALID_ROLES.includes(role)) {
    fail("Invalid dropdown selection");
  }

  if (!email || !email.includes("@") || email.endsWith("@")) {
    fail("Invalid email format");
  }

  if (!password || password.length < 8) {
    fail("Weak password configuration");
  }

  const matchedUser = await findAdminByEmailAndRole(email, role, database);

  if (!matchedUser || matchedUser.password !== password) {
    fail("Incorrect email or password");
  }

  return matchedUser;
}

export async function executeUserAuthJourney(email, role, password, database = []) {
  if (!email || !role || !password) {
    throw new Error("Missing authentication parameters");
  }

  if (!VALID_ROLES.includes(role)) {
    throw new Error("Invalid user role specified for auth journey");
  }

  const authResult = await login(email, role, password, database);

  if (!authResult || !authResult.success) {
    throw new Error("Authentication journey failed");
  }

  return {
    authenticated: true,
    token: authResult.token,
    assignedRole: authResult.role,
    targetView: authResult.redirectTo
  };
}

export async function verifySidenavRouting(token, requestedRoute) {
  if (!token) {
    throw new Error("Session token is required for Sidenav navigation");
  }

  if (!VALID_SIDENAV_ROUTES.includes(requestedRoute)) {
    throw new Error("Invalid sidebar navigation target");
  }

  const securityCheck = await verifyRouteSecurity(token, requestedRoute);

  return {
    route: requestedRoute,
    navigated: securityCheck.authorized,
    statusCode: securityCheck.status
  };
}