const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { updateConfig } = require('../utils/config');
const { EPHEMERAL } = require('../utils/interaction');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setwelcome')
    .setDescription('تحديد قناة رسائل الترحيب')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('قناة الترحيب')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel', true);

    updateConfig('welcomeChannelId', channel.id);

    await interaction.reply({
      content: `✅ تم تعيين قناة الترحيب إلى ${channel}.`,
      ...EPHEMERAL,
    });
  },
};
