const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { buildWelcomeEmbed } = require('../utils/welcome');
const { EPHEMERAL } = require('../utils/interaction');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome-preview')
    .setDescription('معاينة رسالة الترحيب (مثل Welcomer)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const embed = buildWelcomeEmbed(interaction.member, { invite: null });
    await interaction.reply({ embeds: [embed], ...EPHEMERAL });
  },
};
