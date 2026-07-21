import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import db from "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import childRoutes from "./src/routes/child.routes.js";
import reportRoutes from "./src/routes/report.routes.js";
import analyticsRoutes from "./src/routes/analytics.routes.js";

dotenv.config();

var app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());

app.get('/api/test-connection', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DATABASE() AS current_db');
    res.status(200).json({ success: true, database: rows[0].current_db });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/children', childRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

if (!process.env.VITEST) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
