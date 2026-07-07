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
    password: "BNSBalayan2026!"
  }
];

export async function findAdminByEmailAndRole(email, role) {
  const user = mockDatabase.find(
    (account) => account.email === email && account.role === role
  );
  return user || null;
}