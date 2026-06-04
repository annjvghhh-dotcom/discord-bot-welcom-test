const { EmbedBuilder } = require('discord.js');
const { loadConfig } = require('./config');

/** ذهبي — Welcomer */
const WELCOME_COLOR_GOLD = 0xd4af37;

/**
 * رابط البانر الكبير أسفل الـ Embed
 */
function resolveBannerUrl(config, member) {
  const custom = config.welcomeBannerUrl?.trim() || config.welcomeBackgroundUrl?.trim();
  if (custom && /^https?:\/\//i.test(custom)) {
    return custom;
  }
  return member.user.bannerURL({ size: 1024 }) ?? member.guild.bannerURL({ size: 1024 }) ?? null;
}

/**
 * Embed بنفس تخطيط Welcomer Bot
 * @param {import('discord.js').GuildMember} member
 * @param {{ invite?: import('discord.js').Invite | null }} options
 */
function buildWelcomeEmbed(member, options = {}) {
  const config = loadConfig();
  const { guild, user } = member;
  const { invite } = options;

  const inviter = invite?.inviter;
  const inviteCode = invite?.code ?? '—';
  const invitedBy = inviter ? `${inviter}` : '*Unknown*';

  const chatChannel = config.chatChannelId
    ? guild.channels.cache.get(config.chatChannelId)
    : null;
  const supportChannel = config.supportChannelId
    ? guild.channels.cache.get(config.supportChannelId)
    : null;

  const embed = new EmbedBuilder()
    .setColor(WELCOME_COLOR_GOLD)
    .setTitle('Welcome to the Server!')
    .setDescription(
      `Hello ${member}, welcome to **${guild.name}**! enjoy your stay.`
    )
    .addFields(
      {
        name: 'Username',
        value: `\`${user.username}\``,
        inline: true,
      },
      {
        name: 'Invited By',
        value: invitedBy,
        inline: true,
      },
      {
        name: 'Invite Used',
        value: `\`${inviteCode}\``,
        inline: true,
      },
      {
        name: "You're Member",
        value: `**${guild.memberCount}**`,
        inline: true,
      },
      {
        name: 'chat',
        value: chatChannel ? `${chatChannel}` : '—',
        inline: true,
      },
      {
        name: 'Support Channel',
        value: supportChannel ? `${supportChannel}` : '—',
        inline: true,
      }
    )
    .setThumbnail(user.displayAvatarURL({ size: 256 }))
    .setTimestamp();

  const banner = resolveBannerUrl(config, member);
  if (banner) {
    embed.setImage(banner);
  }

  return embed;
}

/**
 * إرسال رسالة ترحيب Welcomer
 * @param {import('discord.js').GuildMember} member
 * @param {{ invite?: import('discord.js').Invite | null }} options
 */
async function sendWelcomeMessage(member, options = {}) {
  const config = loadConfig();

  if (!config.welcomeChannelId) {
    return;
  }

  const channel = await member.guild.channels
    .fetch(config.welcomeChannelId)
    .catch(() => null);

  if (!channel?.isTextBased()) {
    console.warn('[ترحيب] قناة الترحيب غير صالحة أو غير موجودة.');
    return;
  }

  const embed = buildWelcomeEmbed(member, options);

  await channel.send({ embeds: [embed] });
}

module.exports = { buildWelcomeEmbed, sendWelcomeMessage, resolveBannerUrl };
