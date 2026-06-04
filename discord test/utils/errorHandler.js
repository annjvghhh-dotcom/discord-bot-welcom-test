const { EmbedBuilder } = require('discord.js');
const { EPHEMERAL } = require('./interaction');

/**
 * تسجيل الخطأ في الطرفية مع سياق إضافي
 * @param {string} context - مكان حدوث الخطأ
 * @param {Error} error
 */
function logError(context, error) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [${context}]`, error?.stack || error);
}

/**
 * إرسال رد خطأ للمستخدم عند فشل أمر Slash
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {string} message
 */
async function replyError(interaction, message = 'حدث خطأ أثناء تنفيذ الأمر.') {
  const embed = new EmbedBuilder()
    .setColor(0xed4245)
    .setTitle('خطأ')
    .setDescription(message)
    .setTimestamp();

  try {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ embeds: [embed], ...EPHEMERAL });
    } else {
      await interaction.reply({ embeds: [embed], ...EPHEMERAL });
    }
  } catch (replyErr) {
    logError('replyError', replyErr);
  }
}

module.exports = { logError, replyError };
