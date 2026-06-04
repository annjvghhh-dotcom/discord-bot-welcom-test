const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { EPHEMERAL } = require('../utils/interaction');

const WELCOME_COLOR_GOLD = 0xd4af37;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('عرض جميع أوامر البوت'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(WELCOME_COLOR_GOLD)
      .setTitle('Welcomer-Style Bot')
      .setDescription('ترحيب Embed + رول Member تلقائي')
      .addFields(
        { name: '/setwelcome', value: 'قناة الترحيب' },
        { name: '/setbanner', value: 'بانر أسفل الرسالة (رابط صورة)' },
        { name: '/setchannels', value: 'قنوات chat و Support' },
        { name: '/setmemberrole', value: 'رول Member للجدد' },
        { name: '/welcome-preview', value: 'معاينة الترحيب' },
        { name: '/help', value: 'هذه القائمة' }
      )
      .setFooter({ text: 'Discord.js v14 • Welcomer Layout' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ...EPHEMERAL });
  },
};
