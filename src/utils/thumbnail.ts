import { createCanvas, loadImage, registerFont, CanvasRenderingContext2D } from "canvas";
import path from "path";
import fs from "fs";

const fontDir = path.resolve(__dirname, "../../assets/fonts");

try {
  registerFont(path.join(fontDir, "Montserrat-Bold.ttf"), {
    family: "MontserratBold",
    weight: "bold",
  });
  registerFont(path.join(fontDir, "Montserrat-Regular.ttf"), {
    family: "MontserratRegular",
    style: "italic",
  });
} catch (err) {
  console.warn("⚠️ Fonte Montserrat não encontrada, usando padrão do sistema");
}

function getImageForToday(): string {
  const days = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ];
  const today = days[new Date().getDay()];
  const imagePath = path.resolve(`./assets/image/${today}.png`);
  if (!fs.existsSync(imagePath)) {
    const fallback = path.resolve("./image/quarta.png");
    return fs.existsSync(fallback) ? fallback : "";
  }
  return imagePath;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ").filter(Boolean); 
  if (words.length === 0) return [];

  const lines: string[] = [];
  let currentLine: string = words[0] || ""; 

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word || "";
    }
  }
  lines.push(currentLine);
  return lines;
}

async function create({
  outputPath,
  channelTitle = "R&B SOUL LOFI GOSPEL",
  musicTitle,
}: {
  outputPath: string;
  channelTitle?: string;
  musicTitle: string;
}): Promise<boolean> {
  try {
    const width = 1920;
    const height = 1080;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const backgroundPath = getImageForToday();
    if (!backgroundPath || !fs.existsSync(backgroundPath)) {
      console.warn("⚠️ Nenhuma imagem válida encontrada.");
      return false;
    }

    const img = await loadImage(backgroundPath);

    const blackBarWidth = width * 0.15;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, blackBarWidth, height);

    const imgDisplayWidth = width * 0.65;
    const scale = Math.max(imgDisplayWidth / img.width, height / img.height);
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;

    const offsetX = blackBarWidth; 
    const offsetY = (height - scaledHeight) / 2; 

    ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

    const gradientStart = blackBarWidth * 1;
    const gradientEnd = width * 0.45; 
    const gradient = ctx.createLinearGradient(gradientStart, 0, gradientEnd, 0);

    gradient.addColorStop(0, "rgba(0, 0, 0, 1)"); 
    gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.5)"); 
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); 

    ctx.fillStyle = gradient;
    ctx.fillRect(gradientStart, 0, gradientEnd - gradientStart, height);

    // textos
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    const [line1, line2] = ["R&B SOUL", "LOFI GOSPEL"];

    ctx.fillStyle = "#FFCC00";
    ctx.font = "140px MontserratBold";
    ctx.fillText(line1, 80, height / 2 - 90);
    ctx.fillText(line2, 80, height / 2 - 10);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "italic 120px MontserratRegular";
    //ctx.fillText(musicTitle, 80, height / 2 + 80);
    const maxWidth = width * 0.5; // largura máxima para o texto da música
    const lines = wrapText(ctx, musicTitle.toUpperCase(), maxWidth);
    const lineHeight = 95;

    lines.forEach((line, i) => {
      ctx.fillText(line, 80, height / 2 + 100 + i * lineHeight);
    });

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outputPath, buffer);

    console.log("🖼️ Thumbnail gerada:", outputPath);
    return true;
  } catch (err) {
    console.warn("⚠️ Falha ao gerar thumbnail:", (err as Error).message);
    return false;
  }
}

export async function generateThumbnail(title: string) {
  const thumbnailPath = `./assets/thumbnails/thumbnail_${title}.png`;

  const thumbnailGenerated = await create({
    outputPath: thumbnailPath,
    musicTitle: title,
  });

  return { thumbnailGenerated, thumbnailPath };
}
