import { Router } from "express";
import { assignTeamToProject, createProject, deleteProject, getProjects, getProjectsByTeam, updateProject } from "../controllers/projectController";
import { requireAuthentication } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getProjects);
router.post("/", createProject);
router.put("/:projectId", updateProject); // Update a project by ID
router.delete("/:projectId", deleteProject); // Delete a project by ID
router.post("/assign-team", assignTeamToProject); // Assign a team to a project
router.get("/team/:teamId", getProjectsByTeam); // Get projects associated with a team


export default router;
