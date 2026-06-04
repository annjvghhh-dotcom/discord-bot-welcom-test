const { logError } = require('./errorHandler');

/**
 * تهيئة كاش الدعوات لسيرفر
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Guild} guild
 */
async function cacheGuildInvites(client, guild) {
  try {
    const invites = await guild.invites.fetch();
    const map = new Map();

    invites.forEach((invite) => {
      map.set(invite.code, {
        uses: invite.uses ?? 0,
        inviterId: invite.inviter?.id ?? null,
      });
    });

    client.inviteCache.set(guild.id, map);
  } catch (error) {
    logError('cacheGuildInvites', error);
    client.inviteCache.set(guild.id, new Map());
  }
}

/**
 * معرفة الدعوة المستخدمة عند دخول عضو
 * @param {import('discord.js').GuildMember} member
 * @param {import('discord.js').Client} client
 */
async function findUsedInvite(member, client) {
  const guild = member.guild;
  const cached = client.inviteCache.get(guild.id) ?? new Map();

  try {
    const fresh = await guild.invites.fetch();
    let usedInvite = null;

    fresh.forEach((invite) => {
      const old = cached.get(invite.code);
      const currentUses = invite.uses ?? 0;
      const oldUses = old?.uses ?? 0;

      if (currentUses > oldUses) {
        usedInvite = invite;
      }

      cached.set(invite.code, {
        uses: currentUses,
        inviterId: invite.inviter?.id ?? null,
      });
    });

    client.inviteCache.set(guild.id, cached);
    return usedInvite;
  } catch (error) {
    logError('findUsedInvite', error);
    return null;
  }
}

module.exports = { cacheGuildInvites, findUsedInvite };
