const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { updateConfig } = require('../utils/config');
const { EPHEMERAL } = require('../utils/interaction');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setchannels')
    .setDescription('قنوات chat و Support في رسالة الترحيب')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption((option) =>
      option
        .setName('chat')
        .setDescription('قناة chat')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .setName('support')
        .setDescription('قناة الدعم')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),

  async execute(interaction) {
    const chat = interaction.options.getChannel('chat');
    const support = interaction.options.getChannel('support');

    if (!chat && !support) {
      await interaction.reply({
        content: 'حدد قناة chat أو support على الأقل.',
        ...EPHEMERAL,
      });
      return;
    }

    if (chat) updateConfig('chatChannelId', chat.id);
    if (support) updateConfig('supportChannelId', support.id);

    const parts = [];
    if (chat) parts.push(`chat: ${chat}`);
    if (support) parts.push(`support: ${support}`);

    await interaction.reply({
      content: `✅ تم الحفظ — ${parts.join(' | ')}`,
      ...EPHEMERAL,
    });
  },
};
