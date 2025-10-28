import { google } from "googleapis";
import readline from "readline";
import { config } from "dotenv";

config();


async function getYouTubeRefreshToken() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.YT_CLIENT_ID,
    process.env.YT_CLIENT_SECRET,
    process.env.YT_REDIRECT_URI
  );

  const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  console.log("👉 Abra este link e autorize o app:");
  console.log(authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Cole aqui o código de autorização: ", async (code) => {
    try {
      const { tokens } = await oauth2Client.getToken(code.trim());
      console.log("✅ Tokens recebidos com sucesso:");
      console.log(tokens);
      rl.close();
    } catch (err) {
      console.error("❌ Erro ao obter tokens:", err);
      rl.close();
    }
  });
}

getYouTubeRefreshToken();
