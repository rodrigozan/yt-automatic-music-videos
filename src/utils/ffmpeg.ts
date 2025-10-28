import fs from "fs";
import path from "path";
import { spawn } from "child_process";

import { config } from "dotenv";

config();

export async function createVideoFromAssets(day: string): Promise<string> {
  const BASE_DIR = path.resolve("./assets");
  const AUDIO_BASE = path.join(BASE_DIR, "audio");
  const IMAGE_DIR = path.join(BASE_DIR, "image");
  const OUTPUT_DIR = path.join(BASE_DIR, "videos");

  const audioDir = path.join(AUDIO_BASE, day);
  const imagePath = path.join(IMAGE_DIR, `${day}.png`);

  const musicFiles = fs
    .readdirSync(audioDir)
    .filter(
      (f) => f.endsWith(".mp3") || f.endsWith(".wav") || f.endsWith(".m4a")
    );

  if (musicFiles.length === 0) {
    throw new Error(`Nenhum arquivo de áudio encontrado em ${audioDir}`);
  }

  const audioFile = musicFiles[0]!;
  const songName = path.parse(audioFile).name;
  const outputFileName = `${songName}.mp4`;
  const outputFile = path.join(OUTPUT_DIR, outputFileName);

  if (!fs.existsSync(audioDir)) {
    throw new Error(`❌ Pasta de áudio não encontrada: ${audioDir}`);
  }

  const audioFiles = fs
    .readdirSync(audioDir)
    .filter(
      (f) => f.endsWith(".mp3") || f.endsWith(".wav") || f.endsWith(".m4a")
    );

  if (audioFiles.length === 0) {
    throw new Error(`❌ Nenhum arquivo de áudio encontrado em ${audioDir}`);
  }

  const files = audioFiles[0]!;

  const audioPath = path.join(audioDir, files);

  if (!fs.existsSync(imagePath)) {
    throw new Error(`❌ Imagem não encontrada: ${imagePath}`);
  }

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const args = [
    "-loop",
    "1",
    "-i",
    `"${imagePath}"`,
    "-i",
    `"${audioPath}"`,
    "-vf",
    "scale=1920:1080,format=yuv420p",
    "-metadata",
    'artist="Grace and Marc Holloway"',
    "-metadata",
    'album="R&B Gospel Lofi Soul Collection"',
    "-c:v",
    "libx264",
    "-tune",
    "stillimage",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-shortest",
    "-movflags",
    "+faststart",
    "-y",
    `"${outputFile}"`,
  ];

  console.log(`\n🎬 Gerando vídeo para "${day}"...`);
  console.log(`🖼️ Imagem: ${imagePath}`);
  console.log(`🎵 Áudio: ${audioPath}`);
  console.log(`📁 Saída: ${outputFile}`);

  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", args, { shell: true });

    ffmpeg.stdout.on("data", (data) => process.stdout.write(data.toString()));
    ffmpeg.stderr.on("data", (data) => process.stdout.write(data.toString()));

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        console.log("\n✅ Vídeo gerado com sucesso!");
        console.log(`📂 Local: ${outputFile}`);
        resolve(outputFile);
      } else {
        reject(new Error(`❌ FFmpeg terminou com código ${code}`));
      }
    });
  });
}
