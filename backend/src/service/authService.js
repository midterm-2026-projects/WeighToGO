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

const ACTIVE_TOKENS = new Map();

export async function findAdminByEmailAndRole(email, role) {
  const user = mockDatabase.find(
    (account) => account.email === email && account.role === role
  );
  return user || null;
}

export async function login(email, role, password) {
  const user = await findAdminByEmailAndRole(email, role);

  if (!user || user.password !== password) {
    throw new Error("Invalid database credentials");
  }

  const generatedToken = `mock-jwt-token-${Math.random().toString(36).substr(2, 9)}`;
  
  ACTIVE_TOKENS.set(generatedToken, {
    email: user.email,
    role: user.role,
    assignedBarangay: user.assignedBarangay || null
  });

  return {
    success: true,
    token: generatedToken,
    role: user.role,
    redirectTo: "/masterlist"
  };
}

export async function verifyRouteSecurity(token, requestedResource) {
  const protectedResources = ["/masterlist", "/health-reports"];

  if (protectedResources.includes(requestedResource)) {
    if (!token || !ACTIVE_TOKENS.has(token)) {
      throw new Error("Unauthorized access. Redirecting to landing page.");
    }
  }

  return {
    authorized: true,
    status: 200
  };
}

export function getSession(token) {
  return ACTIVE_TOKENS.get(token) || null;
}

export function clearSessions() {
  ACTIVE_TOKENS.clear();
}