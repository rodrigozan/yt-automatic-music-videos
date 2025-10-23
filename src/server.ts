import http from "http";
import { URL } from "url";

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  const { method, url } = req;
  const parsedUrl = new URL(url ?? "", `http://${req.headers.host}`);

  // Configurações de CORS básicas
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (parsedUrl.pathname === "/" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        message: "🧠 Stable Horde API Server running",
        status: "ok",
        timestamp: new Date().toISOString()
      })
    );
  }

  // Exemplo de rota simples /ping
  if (parsedUrl.pathname === "/ping" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ pong: true }));
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
