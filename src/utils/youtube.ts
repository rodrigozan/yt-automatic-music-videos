import fs from "fs";
import { google } from "googleapis";
import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

const fontDir = path.resolve(__dirname, "../../assets/fonts");

try {
  registerFont(path.join(fontDir, "Montserrat-Bold.ttf"), {
    family: "Montserrat",
    weight: "bold",
  });
  registerFont(path.join(fontDir, "Montserrat-Regular.ttf"), {
    family: "Montserrat",
    style: "italic",
  });
} catch (err) {
  console.warn("⚠️ Fonte Montserrat não encontrada, usando padrão do sistema");
}

function getImageForToday(): string {
  const days = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
  const today = days[new Date().getDay()];
  const imagePath = path.resolve(`./assets/image/${today}.png`);

  if (!fs.existsSync(imagePath)) {
    console.warn(`⚠️ Imagem para o dia ${today} não encontrada, tentando imagem padrão...`);
    const fallback = path.resolve("./image/segunda.png");
    return fs.existsSync(fallback) ? fallback : "";
  }

  return imagePath;
}

async function generateThumbnail({
  outputPath,
  channelTitle = "R&B SOUL LOFI GOSPEL",
  musicTitle,
}: {
  outputPath: string;
  channelTitle?: string;
  musicTitle: string;
}): Promise<boolean> {
  try {
    const width = 1280;
    const height = 720;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const backgroundPath = getImageForToday();
    if (!backgroundPath || !fs.existsSync(backgroundPath)) {
      console.warn("⚠️ Nenhuma imagem válida encontrada, pulando geração da thumbnail.");
      return false;
    }

    const img = await loadImage(backgroundPath).catch(() => {
      console.warn("⚠️ Erro ao carregar imagem, pulando geração da thumbnail.");
      return null;
    });

    if (!img) return false;

    ctx.drawImage(img, 0, 0, width, height);

    // gradiente lateral esquerda
    const gradient = ctx.createLinearGradient(0, 0, width / 2, 0);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.75)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width / 2, height);

    // texto
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    // título do canal (amarelo)
    ctx.font = "bold 70px Montserrat";
    ctx.fillStyle = "#FFCC00";
    ctx.fillText(channelTitle, 80, height / 2 - 60);

    // título da música (branco)
    ctx.font = "italic 50px Montserrat";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(musicTitle, 80, height / 2 + 20);

    // salva
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outputPath, buffer);

    console.log("🖼️ Thumbnail gerada:", outputPath);
    return true;
  } catch (err) {
    console.warn("⚠️ Falha ao gerar thumbnail:", (err as Error).message);
    return false;
  }
}

export async function uploadToYouTube(
  videoPath: string,
  title: string,
  description: string,
  tags: string[],
  publishAt?: Date | string
) {
  const thumbnailPath = `./output/thumbnail_${Date.now()}.png`;

  const thumbnailGenerated = await generateThumbnail({
    outputPath: thumbnailPath,
    musicTitle: title,
  });

  const oauth2Client = new google.auth.OAuth2(
    process.env.YT_CLIENT_ID,
    process.env.YT_CLIENT_SECRET,
    process.env.YT_REDIRECT_URI
  );

  oauth2Client.setCredentials({ refresh_token: process.env.YT_REFRESH_TOKEN });
  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  const fileSize = fs.statSync(videoPath).size;
  const publishAtString =
    publishAt instanceof Date ? publishAt.toISOString() : publishAt ?? undefined;

  console.log("📤 Iniciando upload para YouTube:", title);

  const res = await youtube.videos.insert(
    {
      part: ["snippet", "status"],
      notifySubscribers: false,
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId: "10",
          defaultLanguage: "en",
          defaultAudioLanguage: "en",
        },
        status: {
          privacyStatus: "private",
          publishAt: publishAtString,
          madeForKids: false,
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: fs.createReadStream(videoPath),
      },
    },
    {
      onUploadProgress: (evt) => {
        const progress = (evt.bytesRead / fileSize) * 100;
        process.stdout.write(`📈 Upload: ${progress.toFixed(2)}%\r`);
      },
    }
  );

  console.log("\n✅ Upload concluído com sucesso!");
  console.log("🔗 Link:", `https://youtube.com/watch?v=${res.data.id}`);

  // Só tenta enviar thumbnail se ela realmente existir
  if (thumbnailGenerated && res.data.id && fs.existsSync(thumbnailPath)) {
    try {
      await youtube.thumbnails.set({
        videoId: res.data.id,
        media: { body: fs.createReadStream(thumbnailPath) },
      });
      console.log("🖼️ Thumbnail enviada com sucesso!");
    } catch (err) {
      console.warn("⚠️ Erro ao enviar thumbnail:", (err as Error).message);
    }
  } else {
    console.log("ℹ️ Nenhuma thumbnail válida gerada — vídeo enviado sem capa.");
  }

  return res.data;
}
