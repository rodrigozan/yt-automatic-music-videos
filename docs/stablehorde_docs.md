# 🚀 Fluxo de Geração de Imagem (Async Mode)

## 1. Criar solicitação

Endpoint:
POST /generate/async

Descrição:

Cria uma tarefa de geração de imagem de forma assíncrona. A API retorna um id que você deve usar para acompanhar o progresso.

#### Body (JSON):

```bash
{
  "prompt": "cinematic lofi gospel scene, peaceful, black girl with headphones, soft lighting, autumn colors, 16:9, ultra detailed",
  "params": {
    "width": 1920,
    "height": 1080,
    "n": 1,
    "cfg_scale": 7,
    "steps": 25
  },
  "nsfw": false,
  "censor_nsfw": true
}
```


#### Exemplo com cURL:

```bash
curl -X POST https://stablehorde.net/api/v2/generate/async \
  -H "Content-Type: application/json" \
  -H "apikey: anonymous" \
  -d '{
    "prompt": "gospel lo-fi R&B thumbnail, cinematic portrait, warm tone, 16:9",
    "params": {"width": 1280, "height": 720}
  }'
```


#### Resposta:

```bash
{
  "id": "c7ab3921-441d-4a02-b222-xxxxxx",
  "message": "Request received, please poll /generate/check/{id}"
}
```

## 2. Verificar progresso

#### Endpoint:
```GET /generate/check/{id}```

#### Descrição:

Retorna o status da solicitação (sem imagens ainda).

#### Resposta:

```bash
{
  "state": "processing",
  "queue_position": 2,
  "wait_time": 20
}
```

## 3. Obter imagem gerada

#### Endpoint:
```GET /generate/status/{id}```

#### Descrição:

Quando state for completed, retorna as URLs das imagens finais.

#### Resposta:

```bash
{
  "state": "completed",
  "generations": [
    {
      "img": "https://stablehorde.net/image/1234abcd.png",
      "seed": 32423,
      "worker_id": "some-worker",
      "model": "SDXL"
    }
  ]
}
```

## 4. Cancelar solicitação (opcional)

#### Endpoint:

```DELETE /generate/status/{id}```

Cancela um job em andamento.

### 🧠 Recursos Adicionais

Ver modelos disponíveis

```GET /status/models```

Retorna uma lista de todos os modelos ativos atualmente na horde.

### ⚡ Exemplo em Node.js

```javascript
import axios from "axios";

const HORDE_BASE = "https://stablehorde.net/api/v2";
const API_KEY = "anonymous";

export async function generateImage(prompt) {
  const { data: job } = await axios.post(
    `${HORDE_BASE}/generate/async`,
    {
      prompt,
      params: { width: 1920, height: 1080, steps: 25 },
      nsfw: false,
    },
    { headers: { apikey: API_KEY } }
  );

  let status;
  do {
    await new Promise(r => setTimeout(r, 5000));
    const res = await axios.get(`${HORDE_BASE}/generate/status/${job.id}`);
    status = res.data;
  } while (status.state !== "completed");

  return status.generations[0].img;
}
```

### 💾 Sugestão de Integração na sua API

Use este fluxo no seu endpoint /generate-thumbnail:

Recebe prompt e tipo de vídeo (ex: lofi, r&b, worship).

Chama a função generateImage().

Baixa e armazena o arquivo em /assets/thumbnails/.

Retorna a URL pública para ser usada no upload do vídeo (ex: via SUNO ou ffmpeg automation).

### 🧱 Estrutura recomendada de retorno

```json
{
  "success": true,
  "prompt": "gospel lo-fi R&B soul artwork",
  "image_url": "https://stablehorde.net/image/xxxxxx.png",
  "source": "stablehorde"
}
```

### 📜 Licença e Uso

As imagens geradas pela Stable Horde são livres para uso pessoal e comercial, desde que respeitadas as políticas da comunidade e ausência de material NSFW.

### 📘 Referência Oficial

Documentação completa:
```https://stablehorde.net/api/docs```