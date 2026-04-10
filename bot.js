const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

console.log("🚀 Iniciando bot...");

// ✅ ID DO GRUPO
const GRUPO_ID = "120363043961363001@g.us";

// 🎂 LISTA DE ANIVERSÁRIOS
const aniversarios = [
  { nome: "Maria", data: "10-04" },
  { nome: "João", data: "15-04" },
  { nome: "Pedro", data: "09-04" }
];

// ✅ CLIENTE
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// 📱 QR CODE (CORRIGIDO)
client.on('qr', (qr) => {
  console.log("📱 Escaneie o QR abaixo:");
  qrcode.generate(qr, { small: true });
});

// ✅ CONECTADO
client.on('ready', async () => {
  console.log('✅ Bot conectado!');

  // ⏰ RODA TODO DIA ÀS 20:40
  cron.schedule('40 20 * * *', async () => {
    console.log("⏰ Verificando aniversários...");

    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const hojeFormatado = `${dia}-${mes}`;

    for (let pessoa of aniversarios) {
      if (pessoa.data === hojeFormatado) {

        const mensagem = `🎉 Hoje é aniversário do(a) ${pessoa.nome}!\nQue Deus abençoe sua vida 🙏`;

        try {
          const chat = await client.getChatById(GRUPO_ID);
          await chat.sendMessage(mensagem);

          console.log(`✅ Mensagem enviada para ${pessoa.nome}`);
        } catch (erro) {
          console.log("❌ Erro:", erro);
        }
      }
    }
  });
});

// ▶️ INICIAR
client.initialize();
