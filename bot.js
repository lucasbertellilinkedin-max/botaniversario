const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// 🎂 LISTA DE ANIVERSÁRIOS
const aniversarios = [
  { nome: "Maria", data: "10-04" },
  { nome: "João", data: "15-04" },
  { nome: "Lucas", data: "10-04" },
  { nome: "Thiago", data: "11-04" }
];

// 💬 ID DO GRUPO
let GRUPO_ID = "120363043961363001@g.us";

// 🚫 controle anti-flood
let enviadosHoje = new Set();

console.log("🚀 Iniciando bot de aniversários...");

// 🤖 CONFIG DO CLIENTE
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  }
});

// 📱 QR CODE (SÓ TERMINAL, SEM qrcode LIB)
client.on('qr', qr => {
  console.clear();
  console.log("📱 Escaneie o QR Code abaixo:");
  qrcode.generate(qr, { small: false });
});

// 🔌 BOT PRONTO
client.on('ready', () => {
  console.log("✅ Bot conectado com sucesso!");
  console.log("🔍 Monitorando aniversários...");

  verificarAniversarios();

  setInterval(verificarAniversarios, 60 * 1000);

  setInterval(() => {
    enviadosHoje.clear();
    console.log("🔄 Reset diário concluído");
  }, 24 * 60 * 60 * 1000);
});

// 🔎 FUNÇÃO DE VERIFICAÇÃO
async function verificarAniversarios() {
  console.log("🔎 Verificando aniversários...");

  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, '0');
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const hojeFormatado = `${dia}-${mes}`;

  let encontrou = false;

  for (let pessoa of aniversarios) {
    const chave = pessoa.nome + hojeFormatado;

    if (pessoa.data === hojeFormatado && !enviadosHoje.has(chave)) {
      encontrou = true;

      const mensagem =
        `🎉 Hoje é aniversário da ${pessoa.nome}!\n` +
        `Que Deus abençoe sua vida 🙏`;

      console.log(`🎉 Enviando mensagem para ${pessoa.nome}...`);

      try {
        await client.sendMessage(GRUPO_ID, mensagem);
        console.log(`✅ Mensagem enviada com sucesso para ${pessoa.nome}`);

        enviadosHoje.add(chave);
      } catch (err) {
        console.log("❌ Erro ao enviar mensagem:", err.message);
      }
    }
  }

  if (!encontrou) {
    console.log("ℹ️ Nenhum aniversariante hoje.");
  }
}

// 🚀 INICIAR BOT
client.initialize();
