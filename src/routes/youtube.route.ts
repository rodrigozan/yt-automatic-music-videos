import { Router } from "express";
import { YouTubeController } from "../controllers/youtube.controller";

const router = Router();

router.get("/auth/youtube", YouTubeController.auth);
router.get("/oauth2callback", YouTubeController.callback);

export default router;
