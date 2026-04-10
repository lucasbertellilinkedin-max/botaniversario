const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// LISTA DE ANIVERSÁRIOS
const aniversarios = [
  { nome: "Maria", data: "10-04" },
  { nome: "João", data: "15-04" }
];

let GRUPO_ID = "120363043961363001@g.us";

// controle anti-flood
let enviadosHoje = new Set();

// CONFIG DO CLIENTE
console.log("🚀 Iniciando bot de aniversários...");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: false }
});

// QR CODE
client.on('qr', qr => {
  console.log("📱 QR Code gerado! Escaneie para conectar:");
  qrcode.generate(qr, { small: true });
});

// BOT CONECTADO
client.on('ready', () => {
  console.log("✅ Bot conectado com sucesso!");
  console.log("🔍 Iniciando monitoramento de aniversários...");
});

// FUNÇÃO DE VERIFICAÇÃO
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

      await client.sendMessage(GRUPO_ID, mensagem);

      console.log(`✅ Mensagem enviada com sucesso para ${pessoa.nome}`);

      enviadosHoje.add(chave);
    }
  }

  if (!encontrou) {
    console.log("ℹ️ Nenhum aniversariante hoje.");
  }
}

// RODA A CADA 1 MINUTO
setInterval(verificarAniversarios, 60 * 1000);

// RESET DIÁRIO
setInterval(() => {
  enviadosHoje.clear();
  console.log("🔄 Reset diário concluído (lista de enviados limpa)");
}, 24 * 60 * 60 * 1000);

// INICIAR BOT
client.initialize();
