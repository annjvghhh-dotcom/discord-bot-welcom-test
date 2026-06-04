const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { updateConfig } = require('../utils/config');
const { EPHEMERAL } = require('../utils/interaction');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setbanner')
    .setDescription('بانر كبير أسفل رسالة الترحيب (مثل Welcomer)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((option) =>
      option
        .setName('url')
        .setDescription('رابط الصورة — فارغ للإلغاء')
        .setRequired(false)
    ),

  async execute(interaction) {
    const url = interaction.options.getString('url')?.trim() ?? '';

    if (url && !/^https?:\/\/.+/i.test(url)) {
      await interaction.reply({ content: '❌ الرابط غير صالح.', ...EPHEMERAL });
      return;
    }

    updateConfig('welcomeBannerUrl', url);
    updateConfig('welcomeBackgroundUrl', url);

    await interaction.reply({
      content: url
        ? '✅ تم حفظ البانر. سيظهر أسفل رسالة الترحيب.'
        : '✅ تم إلغاء البانر المخصص.',
      ...EPHEMERAL,
    });
  },
};
