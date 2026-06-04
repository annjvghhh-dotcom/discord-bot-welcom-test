const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { loadConfig } = require('./utils/config');
const { loadCommands } = require('./utils/loadCommands');
const { loadEvents } = require('./utils/loadEvents');
const { logError } = require('./utils/errorHandler');
const { isSnowflake } = require('./utils/snowflake');

let config;
try {
  config = loadConfig();
} catch (error) {
  console.error('[خطأ] تعذر قراءة config/config.json:', error.message);
  process.exit(1);
}

const token = config.token || process.env.DISCORD_TOKEN;

if (!token || String(token).includes('ضع_') || String(token).includes('YOUR_')) {
  console.error('[خطأ] عيّن DISCORD_TOKEN في config.json أو متغيرات البيئة');
  process.exit(1);
}

if (!isSnowflake(config.clientId)) {
  console.error('[خطأ] clientId غير صالح');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel],
});

client.commands = loadCommands();
client.inviteCache = new Map();
loadEvents(client);

process.on('unhandledRejection', (error) => logError('unhandledRejection', error));
process.on('uncaughtException', (error) => logError('uncaughtException', error));

client.login(token).catch((error) => {
  logError('login', error);
  process.exit(1);
});
