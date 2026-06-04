const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { updateConfig } = require('../utils/config');
const { EPHEMERAL } = require('../utils/interaction');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setmemberrole')
    .setDescription('تحديد رول Member الذي يُعطى للأعضاء الجدد')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addRoleOption((option) =>
      option.setName('role').setDescription('رول Member').setRequired(true)
    ),

  async execute(interaction) {
    const role = interaction.options.getRole('role', true);

    if (role.managed) {
      await interaction.reply({
        content: '❌ لا يمكن استخدام رول تابع لتطبيق أو بوت.',
        ...EPHEMERAL,
      });
      return;
    }

    updateConfig('memberRoleId', role.id);

    await interaction.reply({
      content: `✅ سيتم إعطاء رول **${role.name}** لكل عضو جديد يدخل السيرفر.`,
      ...EPHEMERAL,
    });
  },
};
