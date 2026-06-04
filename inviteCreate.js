const { sendWelcomeMessage } = require('../utils/welcome');
const { sendLog, buildMemberJoinEmbed } = require('../utils/logs');
const { assignMemberRole } = require('../utils/autoRole');
const { logError } = require('../utils/errorHandler');

module.exports = {
  name: 'guildMemberAdd',

  /**
   * عند دخول عضو جديد: رول Member + ترحيب + سجل
   */
  async execute(member, client) {
    try {
      const { findUsedInvite } = require('../utils/inviteTracker');
      const invite = await findUsedInvite(member, client);

      await assignMemberRole(member);
      await sendWelcomeMessage(member, { invite });
      await sendLog(member.guild, buildMemberJoinEmbed(member));
    } catch (error) {
      logError('guildMemberAdd', error);
    }
  },
};
