import { Router } from "express";
import { requireAuthentication } from "../middleware/authMiddleware";
import { getTeams } from "../controllers/teamController";

const router = Router();

router.get("/", getTeams);

export default router;
