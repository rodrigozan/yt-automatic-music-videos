import { Router } from "express";
import { YouTubeController } from "../controllers/youtube.controller";

const router = Router();

router.get("/youtube/auth", YouTubeController.auth);
router.get("/oauth2callback", YouTubeController.callback);

export default router;
