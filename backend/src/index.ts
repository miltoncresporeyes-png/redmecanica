import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import cookieParser from "cookie-parser";
// import helmet from "helmet";

dotenv.config();

const app = express();
const port = process.env.PORT || 3010;

// Prisma client moved to db.ts
// export const prisma = new PrismaClient();

// app.use(helmet());
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Basic health check
app.get("/", (_req, res) => {
  res.send("RedMecanica Backend Running");
});

import jobsRoutes from './routes/jobs.js';
import servicesRoutes from './routes/services.js';
import usersRoutes from './routes/users.js';
import providersRoutes from './routes/providers.js';
import adminRoutes from './routes/admin.js';
import quotesRoutes from './routes/quotes.js';
import paymentsRoutes from './routes/payments.js';
import authRoutes from './routes/auth.js';

app.use('/api/jobs', jobsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/providers', providersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
