const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'config', 'config.json');

/**
 * دمج متغيرات البيئة (Railway / Render / VPS)
 */
function applyEnv(config) {
  if (process.env.DISCORD_TOKEN) config.token = process.env.DISCORD_TOKEN;
  if (process.env.CLIENT_ID) config.clientId = process.env.CLIENT_ID;
  if (process.env.GUILD_ID) config.guildId = process.env.GUILD_ID;
  if (process.env.WELCOME_CHANNEL_ID) config.welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
  if (process.env.WELCOME_BACKGROUND_URL) config.welcomeBackgroundUrl = process.env.WELCOME_BACKGROUND_URL;
  if (process.env.WELCOME_BANNER_URL) config.welcomeBannerUrl = process.env.WELCOME_BANNER_URL;
  if (process.env.CHAT_CHANNEL_ID) config.chatChannelId = process.env.CHAT_CHANNEL_ID;
  if (process.env.SUPPORT_CHANNEL_ID) config.supportChannelId = process.env.SUPPORT_CHANNEL_ID;
  if (process.env.LOG_CHANNEL_ID) config.logChannelId = process.env.LOG_CHANNEL_ID;
  if (process.env.MEMBER_ROLE_ID) config.memberRoleId = process.env.MEMBER_ROLE_ID;
  return config;
}

function loadConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
  return applyEnv(JSON.parse(raw));
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
}

function updateConfig(key, value) {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  config[key] = value;
  saveConfig(config);
  return applyEnv(config);
}

module.exports = { loadConfig, saveConfig, updateConfig, CONFIG_PATH, applyEnv };
