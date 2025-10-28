import cron from "node-cron";
import { VideoService } from "../services/video.service";

export function startDailyScheduler() {
  cron.schedule("50 14 * * *", async () => {
    console.log("⏰ Iniciando geração automática diária...");
    await VideoService.generateDailyVideo();
  });
}
