const fs = require('fs');
const path = require('path');

/**
 * تحميل جميع أوامر Slash من مجلد commands/
 * @returns {import('discord.js').Collection<string, object>}
 */
function loadCommands() {
  const { Collection } = require('discord.js');
  const commands = new Collection();
  const commandsPath = path.join(__dirname, '..', 'commands');

  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if (!command.data || !command.execute) {
      console.warn(`[تحذير] الأمر في ${file} يفتقد خاصية data أو execute`);
      continue;
    }

    commands.set(command.data.name, command);
  }

  return commands;
}

module.exports = { loadCommands };
