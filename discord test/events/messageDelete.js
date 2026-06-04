const { sendLog, buildMessageDeleteEmbed } = require('../utils/logs');
const { logError } = require('../utils/errorHandler');

module.exports = {
  name: 'messageDelete',

  /**
   * عند حذف رسالة: تسجيل المحتوى إن وُجد في الذاكرة المؤقتة
   */
  async execute(message) {
    try {
      if (!message.guild) return;

      if (message.partial) {
        await message.fetch().catch(() => null);
      }

      if (message.author?.bot) return;

      const embed = buildMessageDeleteEmbed(message);
      await sendLog(message.guild, embed);
    } catch (error) {
      logError('messageDelete', error);
    }
  },
};
