const { ActivityType } = require('discord.js');
const { deploySlashCommands } = require('../utils/deployCommands');
const { logError } = require('../utils/errorHandler');
const { loadConfig } = require('../utils/config');
const { isSnowflake } = require('../utils/snowflake');
const { cacheGuildInvites } = require('../utils/inviteTracker');

module.exports = {
  name: 'clientReady',
  once: true,

  /**
   * يُنفَّذ عند اتصال البوت بنجاح (Discord.js v14: clientReady)
   */
  async execute(client) {
    console.log(`[جاهز] تم تسجيل الدخول كـ ${client.user.tag}`);
    console.log(`[جاهز] يخدم ${client.guilds.cache.size} سيرفر(ات)`);
    client.user.setActivity('/help', { type: ActivityType.Watching });

    client.inviteCache = new Map();
    for (const guild of client.guilds.cache.values()) {
      await cacheGuildInvites(client, guild);
    }
    console.log('[جاهز] تم تحميل كاش الدعوات');

    const config = loadConfig();
    if (!isSnowflake(config.guildId)) {
      try {
        await deploySlashCommands(client);
      } catch (error) {
        logError('auto-deploy', error);
      }
    }
  },
};
