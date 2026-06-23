import { useState } from 'react';

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

export default function LoginPage() {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      const result = Login(role, email, password);
      
      setMessage(result);
      if (result === "Login Successful") {
        setIsSuccess(true);
      } else {
        setIsSuccess(false); 
      }
    } catch (error) {
      setMessage(error.message);
      setIsSuccess(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>System Login</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
            <option value="">-- Select Role --</option>
            <option value="Administrator (Admin)">Administrator (Admin)</option>
            <option value="Barangay Nutrition Scholar">Barangay Nutrition Scholar</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email Address</label>
          <input 
            type="text" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter your email"
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter your password"
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Login
        </button>
      </form>

      {message && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          textAlign: 'center',
          fontWeight: 'bold',
          background: isSuccess ? '#d4edda' : '#f8d7da', 
          color: isSuccess ? '#155724' : '#721c24',
          border: `1px solid ${isSuccess ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}
    </div>
  );
}