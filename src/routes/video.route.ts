import { Router } from "express";
import { VideoController } from "../controllers/video.controller";

const router = Router();

router.get("/generate", VideoController.generate);

export default router;
