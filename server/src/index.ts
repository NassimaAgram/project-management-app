import 'dotenv/config';
import express, { Request, Response } from "express";
import { requireAuthentication } from "./middleware/authMiddleware";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

/* ROUTE IMPORTS */
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import searchRoutes from "./routes/searchRoutes";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";

/* CONFIGURATIONS */
declare global {
  namespace Express {
    interface Request {
      auth?: import('@clerk/express').AuthObject;
    }
  }
}


dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/auth-state', requireAuthentication(), (req:Request, res) => {
  const authState = req.auth
  return res.json(authState)
})

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
