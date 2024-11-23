import { Router } from "express";
import { requireAuthentication } from "../middleware/authMiddleware";
import { getUser, getUsers, postUser } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/", postUser);
router.get("/:clerkId", getUser);

export default router;
