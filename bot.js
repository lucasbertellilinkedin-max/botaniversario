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

// 🤖 CLIENTE WHATSAPP (OTIMIZADO PRA RAILWAY)
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './session'
  }),
  puppeteer: {
    headless: true,
    protocolTimeout: 180000, // 🔥 evita timeout
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process'
    ]
  }
});

// 📱 QR CODE
client.on('qr', (qr) => {
  const qrcode = require('qrcode-terminal');
  console.log("📱 Escaneie o QR abaixo:");
  qrcode.generate(qr, { small: true });
});

// 🟢 ESTADO DO BOT
let botPronto = false;

// 🧠 CONTROLE DIÁRIO
let enviadosHoje = [];
let ultimoDia = null;

// ✅ READY
client.on('ready', () => {
  console.log("✅ Bot conectado!");
  botPronto = true;

  verificarAniversarios();
  setInterval(verificarAniversarios, 60 * 1000);
});

// ❌ ERROS
client.on('auth_failure', msg => {
  console.log("❌ Falha na autenticação:", msg);
});

client.on('disconnected', reason => {
  console.log("⚠️ Desconectado:", reason);
});

// 🔥 FUNÇÃO PRINCIPAL OTIMIZADA
async function verificarAniversarios() {
  if (!botPronto) return;

  try {
    const agora = new Date();

    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const hoje = `${dia}-${mes}`;

    // reset diário automático
    if (ultimoDia !== hoje) {
      enviadosHoje = [];
      ultimoDia = hoje;
    }

    console.log("🔎 Verificando aniversários...");

    for (let pessoa of aniversarios) {
      if (pessoa.data === hoje && !enviadosHoje.includes(pessoa.nome)) {

        try {
          const mensagem = `🎉 Hoje é aniversário do(a) ${pessoa.nome}!`;

          // 🚀 ENVIO DIRETO (SEM getChatById = MAIS RÁPIDO)
          await client.sendMessage(GRUPO_ID, mensagem);

          enviadosHoje.push(pessoa.nome);

          console.log(`✅ Enviado para ${pessoa.nome}`);

        } catch (err) {
          console.log("❌ Erro ao enviar:", err.message);
        }
      }
    }

  } catch (err) {
    console.log("❌ Erro geral:", err.message);
  }
}

// ▶️ INICIAR BOT
client.initialize();
