const { cacheGuildInvites } = require('../utils/inviteTracker');

module.exports = {
  name: 'inviteDelete',

  async execute(invite, client) {
    await cacheGuildInvites(client, invite.guild);
  },
};
