const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

app.use(express.json());

// 🔗 Configurações da PlugzAPI
const PLUGZ_URL = "https://api.plugzapi.com.br/instances/3E5086A6537DF06F0DEC5E06DC0B5B06/token/E9F6A18E28490507147034D5";

app.post("/webhook", async (req, res) => {
  const msg = req.body;
  console.log("📩 Mensagem recebida:", JSON.stringify(msg, null, 2));

  try {
    if (msg.text?.message && msg.fromMe === false) {
      // Enviar mensagem com botões
      await axios.post(`${PLUGZ_URL}/send-button-list`, {
  "phone": "5511999999999",
  "message": "PlugZapi é Bom ?",
  "buttonList": {
    "buttons": [
      {
        "id": "1",
        "label": "Ótimo"
      },
      {
        "id": "2",
        "label": "Excelênte"
      }
    ]
  }
}
      });
      console.log("✅ Botões enviados para:", msg.phone);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Erro ao enviar botões:", err.message);
    res.sendStatus(500);
  }
});

app.get("/", (req, res) => res.send("✅ Webhook para envio de botões ativo."));

app.listen(port, () => {
  console.log(`🚀 Webhook escutando na porta ${port}`);
});
