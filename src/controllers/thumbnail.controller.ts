import { Request, Response } from "express";
import { generateThumbnail } from "../utils/thumbnail";

export class ThumbnailController {

  static async create(req: Request, res: Response) {
    try {
        const thumb = await generateThumbnail(req.body.title)
        return res.json({
            success: true,
            message: "Thumbnail gerada com sucesso!",
            thumbnail: thumb
        });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: (error as Error).message });
    }
  }
  
}
