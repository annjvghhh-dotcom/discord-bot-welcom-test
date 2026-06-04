const { sendLog, buildMemberLeaveEmbed } = require('../utils/logs');
const { logError } = require('../utils/errorHandler');

module.exports = {
  name: 'guildMemberRemove',

  /**
   * عند مغادرة عضو: تسجيل في قناة السجلات
   */
  async execute(member) {
    try {
      await sendLog(member.guild, buildMemberLeaveEmbed(member));
    } catch (error) {
      logError('guildMemberRemove', error);
    }
  },
};
