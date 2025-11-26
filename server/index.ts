import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { authRoutes } from "./routes/auth.js";
import { menuRouter } from "./routes/menu.js";
import { ordersRouter } from "./routes/orders.js";
import { profileRouter } from "./routes/profile.js";

export function createServer() {
  const app = express();

  // Middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "script-src": ["'self'", "'unsafe-inline'"],
          "img-src": ["'self'", "data:", "https://api.builder.io", "https://cdn.builder.io"],
          "connect-src": ["'self'"], // Removed Supabase URL
        },
      },
    })
  );
  app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(limiter);

  app.use("/uploads", express.static("uploads"));

  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/v1/menu", menuRouter);
  app.use("/api/v1/orders", ordersRouter);
  app.use("/api/v1/profile", profileRouter);

  return app;
}
