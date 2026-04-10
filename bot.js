const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log("🚀 Iniciando bot...");

process.env.TZ = "America/Sao_Paulo";

// 🎂 ANIVERSÁRIOS
const aniversarios = [
  { nome: "Maria", data: "10-04" },
  { nome: "João", data: "15-04" },
  { nome: "Pedro", data: "09-04" }
];

// 📌 GRUPO
const GRUPO_ID = "120363043961363001@g.us";

// 🤖 CLIENTE WHATSAPP
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './session'
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  }
});

// 📱 QR CODE (CORRETO)
client.on('qr', (qr) => {
  const qrcode = require('qrcode-terminal');
  console.log("📱 Escaneie o QR abaixo:");
  qrcode.generate(qr, { small: true });
});

// ❌ ERROS DE AUTENTICAÇÃO
client.on('auth_failure', msg => {
  console.log("❌ Falha na autenticação:", msg);
});

// ⚠️ DESCONECTADO
client.on('disconnected', reason => {
  console.log("⚠️ Desconectado:", reason);
});

// 🟢 CONTROLE DE ESTADO (IMPORTANTE)
let botPronto = false;

// 🧠 CONTROLE DE DUPLICAÇÃO
let enviadosHoje = [];
let ultimoDia = null;

// ✅ QUANDO BOT ESTÁ PRONTO
client.on('ready', () => {
  console.log("✅ Bot conectado!");
  botPronto = true;

  // roda imediatamente
  verificarAniversarios();

  // loop seguro
  setInterval(verificarAniversarios, 60 * 1000);
});

// 🔥 FUNÇÃO PRINCIPAL (SEGURA)
async function verificarAniversarios() {
  if (!botPronto) return;

  try {
    const agora = new Date();

    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const hoje = `${dia}-${mes}`;

    // reset diário
    if (ultimoDia !== hoje) {
      enviadosHoje = [];
      ultimoDia = hoje;
    }

    console.log("🔎 Verificando aniversários...");

    for (let pessoa of aniversarios) {
      if (pessoa.data === hoje && !enviadosHoje.includes(pessoa.nome)) {

        try {
          const chat = await client.getChatById(GRUPO_ID);

          await chat.sendMessage(
            `🎉 Hoje é aniversário do(a) ${pessoa.nome}!`
          );

          enviadosHoje.push(pessoa.nome);

          console.log(`✅ Enviado para ${pessoa.nome}`);
        } catch (err) {
          console.log("❌ Erro ao enviar mensagem:", err.message);
        }
      }
    }

  } catch (err) {
    console.log("❌ Erro geral:", err.message);
  }
}

// ▶️ INICIAR BOT
client.initialize();
