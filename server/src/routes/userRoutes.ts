import { Router } from "express";
import { requireAuthentication } from "../middleware/authMiddleware";
import { getUser, getUsers, postUser, updateUser } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/", postUser);
router.get("/:clerkId", getUser);
router.put("/:clerkId", updateUser);

export default router;
