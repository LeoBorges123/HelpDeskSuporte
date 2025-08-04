const express = require("express");
const { Pool } = require("pg");
const app = express();
const port = 3000;

app.use(express.json());

// Configuração do PostgreSQL no Railway
const pool = new Pool({
  host: "turntable.proxy.rlwy.net",
  user: "postgres",
  password: "LyYIUXzMuquWsKyMKAlEzBWqVPnvXDdB",
  database: "railway",
  port: 56079,
  ssl: { rejectUnauthorized: false }
});

// Webhook que será chamado pela PlugzAPI ao enviar ou receber mensagens
app.post("/webhook", async (req, res) => {
  const msg = req.body;
  console.log("📩 RECEBIDO:", JSON.stringify(msg, null, 2));

  try {
    const query = 
      INSERT INTO helpdeskinformacoes (
        isStatusReply, chatLid, connectedPhone, waitingMessage,
        isEdit, isGroup, isNewsletter, instanceId, messageId,
        phone, fromMe, momment, status, chatName, senderPhoto,
        senderName, photo, broadcast, participantLid, forwarded,
        type, fromApi, mensagem, data
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, to_timestamp($12 / 1000.0), $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, NOW()
      )
    ;
    const values = [
      msg.isStatusReply || false,
      msg.chatLid || null,
      msg.connectedPhone || null,
      msg.waitingMessage || false,
      msg.isEdit || false,
      msg.isGroup || false,
      msg.isNewsletter || false,
      msg.instanceId || null,
      msg.messageId || null,
      msg.phone || null,
      msg.fromMe || false,
      msg.momment || Date.now(),
      msg.status || null,
      msg.chatName || null,
      msg.senderPhoto || null,
      msg.senderName || null,
      msg.photo || null,
      msg.broadcast || false,
      msg.participantLid || null,
      msg.forwarded || false,
      msg.type || null,
      msg.fromApi || false,
      msg.text?.message || null
    ];

    await pool.query(query, values);
    console.log("✅ Mensagem salva com sucesso no banco PostgreSQL.");
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ ERRO ao salvar no banco:", err.message);
    res.sendStatus(500);
  }
});

// Endpoint opcional para testar se está online
app.get("/", (req, res) => {
  res.send("✅ Webhook ativo e rodando.");
});

// Endpoint para consultar mensagens
app.get("/mensagens", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM helpdeskinformacoes ORDER BY id DESC LIMIT 100");
    res.json(rows);
  } catch (err) {
    console.error("❌ ERRO ao buscar mensagens:", err.message);
    res.status(500).send("Erro ao buscar mensagens.");
  }
});

app.listen(port, () => {
  console.log(🚀 Webhook ativo na porta ${port});
});
