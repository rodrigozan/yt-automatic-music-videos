import cron from "node-cron";
import { VideoService } from "../services/video.service";

export function startDailyScheduler() {
  // Rodar todos os dias às 06:00
  cron.schedule("0 6 * * 1-5", async () => {
    console.log("⏰ Iniciando geração automática diária...");
    await VideoService.generateDailyVideo();
  });
}
