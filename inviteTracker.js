const { PermissionFlagsBits } = require('discord.js');
const { loadConfig } = require('./config');
const { logError } = require('./errorHandler');

/**
 * الحصول على رول العضو من الإعدادات أو بالاسم "member"
 * @param {import('discord.js').Guild} guild
 */
async function resolveMemberRole(guild) {
  const config = loadConfig();

  if (config.memberRoleId) {
    const fromConfig =
      guild.roles.cache.get(config.memberRoleId) ??
      (await guild.roles.fetch(config.memberRoleId).catch(() => null));
    if (fromConfig) return fromConfig;
  }

  return (
    guild.roles.cache.find(
      (role) => role.name.toLowerCase() === 'member' && !role.managed
    ) ?? null
  );
}

/**
 * إعطاء رول Member لعضو جديد
 * @param {import('discord.js').GuildMember} member
 */
async function assignMemberRole(member) {
  try {
    const role = await resolveMemberRole(member.guild);

    if (!role) {
      console.warn(
        '[رول] لم يُعثر على رول Member. أنشئ رولاً باسم member أو استخدم /setmemberrole'
      );
      return;
    }

    if (member.roles.cache.has(role.id)) {
      return;
    }

    const botMember = member.guild.members.me;

    if (!botMember?.permissions.has(PermissionFlagsBits.ManageRoles)) {
      console.warn('[رول] البوت يحتاج صلاحية Manage Roles');
      return;
    }

    if (role.position >= botMember.roles.highest.position) {
      console.warn('[رول] ارفع رتبة البوت فوق رول Member في إعدادات السيرفر');
      return;
    }

    await member.roles.add(role, 'عضو جديد — رول تلقائي');
    console.log(`[رول] تم إعطاء ${role.name} لـ ${member.user.tag}`);
  } catch (error) {
    logError('assignMemberRole', error);
  }
}

module.exports = { assignMemberRole, resolveMemberRole };
