import { google } from "googleapis";

export class YouTubeService {
  private oauth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.YT_CLIENT_ID,
      process.env.YT_CLIENT_SECRET,
      process.env.YT_REDIRECT_URI
    );
  }

  getAuthUrl(): string {
    const scopes = ["https://www.googleapis.com/auth/youtube.upload"];
    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
    });
  }

  async exchangeCodeForTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }
}
