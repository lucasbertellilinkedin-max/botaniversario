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

const GRUPO_ID = "120363043961363001@g.us";

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './session'
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// 📱 QR CODE
client.on('qr', (qr) => {
  console.log("📱 Escaneie o QR:");
  qrcode.generate(qr, { small: true });
});

// ✅ EVITA DUPLICAR MENSAGEM NO MESMO DIA
let enviadosHoje = [];
let ultimoDia = null;

// 🔥 FUNÇÃO DE VERIFICAÇÃO RÁPIDA
async function verificarAniversarios() {
  const agora = new Date();

  const dia = String(agora.getDate()).padStart(2, '0');
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const hoje = `${dia}-${mes}`;

  // reset diário automático
  if (ultimoDia !== hoje) {
    enviadosHoje = [];
    ultimoDia = hoje;
  }

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
        console.log("❌ Erro:", err);
      }
    }
  }
}

// ⚡ RODA ASSIM QUE CONECTA
client.on('ready', async () => {
  console.log("✅ Bot conectado!");

  // roda imediatamente
  verificarAniversarios();

  // depois roda a cada 30 segundos (rápido e leve)
  setInterval(verificarAniversarios, 30 * 1000);
});

client.initialize();
