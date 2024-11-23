import { Router } from "express";
import { search } from "../controllers/searchController";
import { requireAuthentication } from "../middleware/authMiddleware";


const router = Router();

router.get("/", search);

export default router;
