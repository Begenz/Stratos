const { REST, Routes } = require('discord.js');
const { DISCORD_TOKEN, CLIENT_ID } = process.env;
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands/rpg');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔄 Refreshing global application (/) commands...');
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Global slash commands deployed.');
  } catch (error) {
    console.error('❌ Failed to deploy commands:', error);
  }
})();
