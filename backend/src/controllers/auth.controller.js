import { loginService } from '../service/loginService.js';
import { login, clearSessions, getSession } from '../service/authService.js';

export async function loginController(req, res) {
  try {
    const { role, email, password } = req.body;
    const user = await loginService(role, email, password);
    const result = await login(email, role, password, [user]);
    res.json(result);
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
}

export async function logoutController(req, res) {
  clearSessions();
  res.json({ success: true, message: 'Logged out successfully' });
}

export async function sessionController(req, res) {
  const session = getSession(req.token);
  if (!session) {
    return res.status(401).json({ success: false, error: 'No active session' });
  }
  res.json({ success: true, user: session });
}
