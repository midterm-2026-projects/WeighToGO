const ACTIVE_TOKENS = new Map();

// Accepts 'database' dynamically as a parameter
export async function findAdminByEmailAndRole(email, role, database = []) {
  const user = database.find(
    (account) => account.email === email && account.role === role
  );
  return user || null;
}

// Accepts 'database' here to pass it along to findAdminByEmailAndRole
export async function login(email, role, password, database = []) {
  const user = await findAdminByEmailAndRole(email, role, database);

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
    assignedBarangay: user.assignedBarangay || null,
    redirectTo: user.role === 'Barangay Nutrition Scholar' ? '/bns/masterlist' : '/health-trends'
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

export function clearSession(token) {
  if (token) {
    ACTIVE_TOKENS.delete(token);
  }
}

export function clearSessions() {
  ACTIVE_TOKENS.clear();
}