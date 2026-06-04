const { logError, replyError } = require('../utils/errorHandler');
const { EPHEMERAL } = require('../utils/interaction');

module.exports = {
  name: 'interactionCreate',

  /**
   * معالجة تفاعلات Slash Commands
   */
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    if (!interaction.inGuild()) {
      await interaction.reply({ content: 'هذا البوت يعمل داخل السيرفرات فقط.', ...EPHEMERAL });
      return;
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      await replyError(interaction, 'هذا الأمر غير موجود.');
      return;
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      logError(`command:${interaction.commandName}`, error);
      await replyError(interaction);
    }
  },
};
