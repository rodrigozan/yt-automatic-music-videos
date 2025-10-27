import { Request, Response } from "express";
import { VideoService } from "../services/video.service";

export class VideoController {
  static async generate(_req: Request, res: Response) {
    try {
      const result = await VideoService.generateDailyVideo();
      return res.json({
        success: true,
        message: "Vídeo gerado com sucesso!",
        result
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}
