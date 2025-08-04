const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

app.use(express.json());

// 🔗 Configuração PlugzAPI
const PLUGZ_URL = "https://api.plugzapi.com.br/instances/3E5086A6537DF06F0DEC5E06DC0B5B06/token/E9F6A18E28490507147034D5";

app.post("/webhook", async (req, res) => {
  const msg = req.body;
  console.log("📩 Mensagem recebida:", JSON.stringify(msg, null, 2));

  try {
    if (msg.text?.message && msg.fromMe === false) {
      await axios.post(`${PLUGZ_URL}/send-button-list`, {
        phone: msg.phone,
        message: "Qual o tipo de suporte você precisa?",
        buttonList: {
          buttons: [
            { id: "duvida", label: "📘 Dúvida" },
            { id: "problema", label: "🛠 Problema" }
          ]
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
