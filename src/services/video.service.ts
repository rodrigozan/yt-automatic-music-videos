import path from "path";

import { createVideoFromAssets } from "../utils/ffmpeg";
import { uploadToYouTube } from "../utils/youtube";

export class VideoService {
  static async generateDailyVideo() {
    const days = ["domingo","segunda","terca","quarta","quinta","sexta","sabado"] as const;
    const today: string = days[new Date().getDay()] ?? "domingo";

    if (!["segunda", "terca", "quarta", "quinta", "sexta"].includes(today)) {
      console.log("📅 Hoje não é dia útil, ignorando geração de vídeo.");
      return;
    }

    try {
      const videoPath = await createVideoFromAssets(today);

      const title = path.parse(videoPath).name;
      const description = `🎵 Welcome to ${title}

        Lofi Gospel | Relaxing Worship Music | R&B Soul Lofi Gospel

        ${title} is a soulful blend of *R&B, Lo-Fi, and Gospel*, inviting you to rest in the nearness of God. Smooth Rhodes chords, soft beats, and warm bass lines create a peaceful space for worship, reflection, and intimacy with the Holy Spirit. A soundtrack for prayer, study, and quiet devotion — where every note whispers: *You are not alone; He is here.*

        #RBLofi #GospelLofi #LoFiWorship #RBSoul #ChristianLoFi #FaithMusic #WorshipBeats #SoulfulWorship #PeacefulMusic #GospelChill

        ***

        You can like this:

        - https://youtu.be/nb2mKh03cbo
        - https://youtu.be/h9htS9A52r4
        - https://youtu.be/3JA9xFubmaU

        Our R&B Playlists:

        - https://youtu.be/3JA9xFubmaU
        - https://youtu.be/5x2P7XVtClw

        ***

        Hashtags:

        #RBLofi #GospelLofi #LoFiWorship #RBSoul #ChristianLoFi #FaithMusic #WorshipBeats #SoulfulWorship #PeacefulMusic #GospelChill

        ***
      `;

      const tags = ["lofi christian music", "lofi worship", "worship", "christian lofi music", "christian sleep music", "lofi", "christian lofi", "sleep music", "calming music", "bible", "christian study music", "christian instrumental music", "christian music", "r&b playlist", "r&b gospel", "christian meditation music", "christian chill", "christian lofi beats", "worship playlist", "lofi cristão"]

      const publishAt = new Date();
      publishAt.setHours(18, 15, 0, 0);
      
      await uploadToYouTube(videoPath, title, description, tags, publishAt);

      return { success: true, uploaded: true, video: videoPath };
    } catch (error: any) {
      console.error("❌ Erro ao gerar/enviar vídeo:", error.message);
      return { success: false, error: error.message };
    }
  }
}
