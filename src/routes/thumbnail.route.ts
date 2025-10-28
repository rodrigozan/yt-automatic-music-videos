import { Router } from "express";
import { ThumbnailController } from "../controllers/thumbnail.controller";

const router = Router();

router.get("/thumbnail", ThumbnailController.create);

export default router;