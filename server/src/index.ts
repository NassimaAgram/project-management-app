import 'dotenv/config';
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { requireAuthentication } from "./middleware/authMiddleware";
import {
  clerkMiddleware,
  createClerkClient,
} from "@clerk/express";

/* ROUTE IMPORTS */
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import searchRoutes from "./routes/searchRoutes";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";

/* CONFIGURATIONS */

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

dotenv.config();
const app = express();

// Disable caching middleware
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
});
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*", // Allow all origins or specify your front-end domain
    methods: ['GET', 'POST', 'PUT', 'PATCH'],
  } 
  ));
app.use(clerkMiddleware());

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/search", searchRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);

/* SERVER */
const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});

export{ app, server };
