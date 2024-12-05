import { Router } from "express";
import {
  assignTask,
  createTask,
  deleteTask,
  getOverdueTasks,
  getTasks,
  getUserTasks,
  updateTask,
  updateTaskStatus,
} from "../controllers/taskController";
import { requireAuthentication } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:taskId/status", updateTaskStatus);
router.put("/:taskId", updateTask); // Update task details
router.delete("/:taskId", deleteTask); // Delete task by ID
router.get("/user/:userId", getUserTasks); // Get tasks for a specific user
router.get("/overdue", getOverdueTasks); // Get overdue tasks
router.put("/:taskId/assign", assignTask); // Assign a task to a user

export default router;
