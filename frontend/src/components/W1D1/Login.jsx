import { useState } from "react";

export function Login(role, email, password) {
  const validRoles = ["Administrator (Admin)", "Barangay Nutrition Scholar"];

  if (!role || !validRoles.includes(role)) {
    throw new Error("Invalid dropdown selection");
  }

  if (!email || !email.includes("@") || email.endsWith("@")) {
    throw new Error("Invalid email format");
  }

  if (!password || password.length < 8) {
    throw new Error("Weak password configuration");
  }

  if (role === "Administrator (Admin)" && email === "user@health.gov.ph" && password === "Balayan2026!") {
    return "Login Successful";
  }
  
  if (role === "Barangay Nutrition Scholar" && email === "bns@health.gov.ph" && password === "BNSBalayan2026!") {
    return "Login Successful";
  }

  return "Incorrect email or password";
}

export default function LoginPage({ handleLogin }) {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (handleLogin) {
      handleLogin(email, password);
    }

    try {
      const result = Login(role, email, password);
      setMessage(result);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Weigh To Go Portal</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="role-select">Role</label>
          <select
            id="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">-- Select Role --</option>
            <option value="Administrator (Admin)">Administrator (Admin)</option>
            <option value="Barangay Nutrition Scholar">Barangay Nutrition Scholar</option>
          </select>
        </div>

        <div>
          <label htmlFor="email-input">Email Address</label>
          <input
            id="email-input"
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password-input">Password</label>
          <input
            id="password-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Login</button>
      </form>

      {message && <div>{message}</div>}
    </div>
  );
}