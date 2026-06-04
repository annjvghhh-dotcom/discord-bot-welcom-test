const { cacheGuildInvites } = require('../utils/inviteTracker');

module.exports = {
  name: 'inviteCreate',

  async execute(invite, client) {
    await cacheGuildInvites(client, invite.guild);
  },
};
