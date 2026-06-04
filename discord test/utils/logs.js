const { EmbedBuilder } = require('discord.js');
const { loadConfig } = require('./config');

/**
 * إرسال سجل إلى قناة السجلات إن وُجدت
 * @param {import('discord.js').Guild} guild
 * @param {EmbedBuilder} embed
 */
async function sendLog(guild, embed) {
  const config = loadConfig();

  if (!config.logChannelId) {
    return;
  }

  const channel = await guild.channels.fetch(config.logChannelId).catch(() => null);

  if (!channel?.isTextBased()) {
    console.warn('[سجلات] قناة السجلات غير صالحة أو غير موجودة.');
    return;
  }

  await channel.send({ embeds: [embed] });
}

/**
 * سجل دخول عضو
 */
function buildMemberJoinEmbed(member) {
  return new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle('عضو انضم')
    .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: 'العضو', value: `${member.user.tag} (\`${member.id}\`)`, inline: true },
      { name: 'تاريخ إنشاء الحساب', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
      { name: 'عدد الأعضاء', value: `${member.guild.memberCount}`, inline: true }
    )
    .setTimestamp();
}

/**
 * سجل خروج عضو
 */
function buildMemberLeaveEmbed(member) {
  return new EmbedBuilder()
    .setColor(0xed4245)
    .setTitle('عضو غادر')
    .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: 'العضو', value: `${member.user.tag} (\`${member.id}\`)`, inline: true },
      { name: 'عدد الأعضاء', value: `${member.guild.memberCount}`, inline: true }
    )
    .setTimestamp();
}

/**
 * سجل حذف رسالة
 */
function buildMessageDeleteEmbed(message) {
  const author = message.author;
  const channel = message.channel;

  const embed = new EmbedBuilder()
    .setColor(0xfee75c)
    .setTitle('رسالة محذوفة')
    .addFields(
      { name: 'القناة', value: channel ? `${channel}` : 'غير معروف', inline: true },
      {
        name: 'المرسل',
        value: author ? `${author.tag} (\`${author.id}\`)` : 'غير معروف',
        inline: true,
      },
      {
        name: 'المحتوى',
        value: message.content?.slice(0, 1024) || '*لا يوجد محتوى (قد تكون مرفقات فقط)*',
      }
    )
    .setTimestamp();

  if (author) {
    embed.setThumbnail(author.displayAvatarURL({ size: 256 }));
  }

  return embed;
}

module.exports = {
  sendLog,
  buildMemberJoinEmbed,
  buildMemberLeaveEmbed,
  buildMessageDeleteEmbed,
};
