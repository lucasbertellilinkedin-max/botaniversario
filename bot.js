const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

console.log("🚀 Iniciando bot...");

// 🎂 LISTA DE ANIVERSÁRIOS
const aniversarios = [
  { nome: "Maria", data: "10-04" },
  { nome: "João", data: "15-04" },
  { nome: "Pedro", data: "09-04" } // exemplo
];

const GRUPO_ID = "120363043961363001@g.us";

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: false }
});

// 📱 QR CODE
client.on('qr', qr => {
  console.log("📱 Escaneie o QR Code:");
  qrcode.generate(qr, { small: true });
});

// ✅ BOT PRONTO
client.on('ready', async () => {
  console.log('✅ Bot conectado!');

  // 📋 LISTAR GRUPOS (opcional)
  const chats = await client.getChats();

  console.log("\n📋 LISTA DE GRUPOS:");
  chats.forEach(chat => {
    if (chat.isGroup) {
      console.log(`👥 Nome: ${chat.name}`);
      console.log(`🆔 ID: ${chat.id._serialized}`);
      console.log("----------------------");
    }
  });

  // ⏰ RODA TODO DIA ÀS 09:00
  cron.schedule('0 9 * * *', async () => {
    console.log("⏰ Verificando aniversários...");

    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const hojeFormatado = `${dia}-${mes}`;

    for (let pessoa of aniversarios) {
      if (pessoa.data === hojeFormatado) {

        const mensagem =
          `🎉 Hoje é aniversário do(a) ${pessoa.nome}!\n` +
          `Que Deus abençoe sua vida 🙏`;

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
