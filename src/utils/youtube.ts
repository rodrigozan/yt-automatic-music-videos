import fs from "fs";
import { google } from "googleapis";
//import path from "path";

export async function uploadToYouTube(videoPath: string, title: string, description: string, tags: string[], publishAt?: Date | string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.YT_CLIENT_ID,
    process.env.YT_CLIENT_SECRET,
    process.env.YT_REDIRECT_URI
  );

  // refresh_token salvo após autenticação manual uma vez
  oauth2Client.setCredentials({ refresh_token: process.env.YT_REFRESH_TOKEN });

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  const fileSize = fs.statSync(videoPath).size;

  const publishAtString =
    publishAt instanceof Date ? publishAt.toISOString() : publishAt ?? undefined;

  console.log("📤 Iniciando upload para YouTube:", title);

  const res = await youtube.videos.insert({
    part: ["snippet", "status"],
    notifySubscribers: false,
    requestBody: {
      snippet: {
        title,
        description,
        tags,
        categoryId: "10" ,
        defaultLanguage: "en",
        defaultAudioLanguage: "en",
      },
      status: {
        privacyStatus: "private",
        publishAt: publishAtString,
        madeForKids: false,
        selfDeclaredMadeForKids: false
      }
    },
    media: {
      body: fs.createReadStream(videoPath)
    }
  },
  {
    onUploadProgress: evt => {
      const progress = (evt.bytesRead / fileSize) * 100;
      process.stdout.write(`📈 Upload: ${progress.toFixed(2)}%\r`);
    }
  });

  console.log("\n✅ Upload concluído com sucesso!");
  console.log("🔗 Link:", `https://youtube.com/watch?v=${res.data.id}`);
  return res.data;
}
