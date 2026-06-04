const { deploySlashCommands } = require('./utils/deployCommands');
const { logError } = require('./utils/errorHandler');

/**
 * تسجيل أوامر Slash — شغّل: npm run deploy
 */
deploySlashCommands().catch((error) => {
  logError('deploy-commands', error);
  process.exit(1);
});
