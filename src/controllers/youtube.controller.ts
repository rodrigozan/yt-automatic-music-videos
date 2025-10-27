import { Request, Response } from "express";
import { YouTubeService } from "../services/youtube.service";

const youtubeService = new YouTubeService();

export class YouTubeController {
  static async auth(_req: Request, res: Response) {
    try {
      const url = youtubeService.getAuthUrl();
      res.redirect(url);
    } catch (err) {
      console.error("❌ Erro ao gerar URL de autenticação:", err);
      res.status(500).send("Erro ao gerar URL de autenticação");
    }
  }

  static async callback(req: Request, res: Response) {
    const code = req.query.code as string;

    if (!code) {
      return res.status(400).send("Código de autorização ausente.");
    }

    try {
      const tokens = await youtubeService.exchangeCodeForTokens(code);
      console.log("✅ Tokens recebidos:", tokens);

      return res.send(`
        <h2>✅ Tokens recebidos com sucesso!</h2>
        <pre>${JSON.stringify(tokens, null, 2)}</pre>
        <p>Copie o <b>refresh_token</b> e adicione no seu arquivo .env.</p>
      `);
    } catch (err) {
      console.error("❌ Erro ao trocar o código por tokens:", err);
      return res.status(500).send("Erro ao gerar token.");
    }
  }
}
