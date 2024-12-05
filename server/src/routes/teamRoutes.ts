import { Router } from "express";
import { requireAuthentication } from "../middleware/authMiddleware";
import { assignUsersToTeam, createTeam, getTeamById, getTeams, updateTeam } from "../controllers/teamController";

const router = Router();

router.get("/", getTeams); // Fetch all teams
router.get("/:teamId", getTeamById); // Fetch a single team by ID
router.post("/", createTeam); // Create a new team
router.put("/:teamId", updateTeam); // Update a team
router.post("/:teamId/users", assignUsersToTeam); // Assign users to a team


export default router;
