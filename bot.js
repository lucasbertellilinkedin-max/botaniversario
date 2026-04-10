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

// 📌 ID DO GRUPO
const GRUPO_ID = "120363043961363001@g.us";

// 🤖 CLIENTE WHATSAPP (ESTÁVEL PRA RAILWAY)
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

// 📱 QR CODE CORRETO (NUNCA USA LINK)
client.on('qr', (qr) => {
  console.log("📱 Escaneie o QR abaixo:");
  qrcode.generate(qr, { small: true });
});

// ✅ STATUS CONEXÃO
client.on('ready', () => {
  console.log("✅ Bot conectado com sucesso!");

  verificarAniversarios(); // roda na hora
  setInterval(verificarAniversarios, 60 * 1000); // checa a cada 1 minuto
});

// ❌ ERROS
client.on('auth_failure', msg => {
  console.log("❌ Falha na autenticação:", msg);
});

client.on('disconnected', reason => {
  console.log("⚠️ Desconectado:", reason);
});

// 🧠 CONTROLE PRA NÃO REPETIR MENSAGEM
let enviadosHoje = [];
let ultimoDia = null;

// 🔥 FUNÇÃO PRINCIPAL
async function verificarAniversarios() {
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
        const mensagem = `🎉 Hoje é aniversário do(a) ${pessoa.nome}!`;

        const chat = await client.getChatById(GRUPO_ID);
        await chat.sendMessage(mensagem);

        enviadosHoje.push(pessoa.nome);

        console.log(`✅ Enviado para ${pessoa.nome}`);
      }
    }
  } catch (err) {
    console.log("❌ Erro na verificação:", err);
  }
}

// ▶️ INICIAR BOT
client.initialize();
