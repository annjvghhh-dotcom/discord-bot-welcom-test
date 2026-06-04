const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { loadConfig, updateConfig } = require('./config');
const { loadCommands } = require('./loadCommands');
const { isSnowflake } = require('./snowflake');
const { logError } = require('./errorHandler');

/**
 * اكتشاف معرف السيرفر تلقائياً إذا كان غير مضبوط في config
 * @param {string} token
 * @param {string} guildId
 * @returns {Promise<string>}
 */
async function resolveGuildId(token, guildId, existingClient = null) {
  if (isSnowflake(guildId)) {
    return guildId;
  }

  if (existingClient) {
    const guild = existingClient.guilds.cache.first();
    if (!guild) {
      throw new Error('البوت غير موجود في أي سيرفر. ادعُ البوت إلى سيرفرك أولاً.');
    }
    updateConfig('guildId', guild.id);
    console.log(`[إعداد] تم حفظ guildId تلقائياً: ${guild.id} (${guild.name})`);
    return guild.id;
  }

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  try {
    await client.login(token);
    await client.guilds.fetch();
    return await resolveGuildId(token, guildId, client);
  } finally {
    client.destroy();
  }
}

/**
 * تسجيل أوامر Slash على السيرفر
 */
async function deploySlashCommands(existingClient = null) {
  const config = loadConfig();

  if (!config.token || !isSnowflake(config.clientId)) {
    throw new Error('تأكد من token و clientId في config/config.json');
  }

  const guildId = await resolveGuildId(config.token, config.guildId, existingClient);
  const commands = loadCommands();
  const body = commands.map((cmd) => cmd.data.toJSON());
  const rest = new REST({ version: '10' }).setToken(config.token);

  await rest.put(Routes.applicationGuildCommands(config.clientId, guildId), { body });

  console.log(`[نشر] تم تسجيل ${body.length} أمر(اً) على السيرفر.`);
}

module.exports = { deploySlashCommands, resolveGuildId };
