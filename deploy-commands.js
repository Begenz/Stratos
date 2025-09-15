require('dotenv').config();

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

// Replace with your test server's Guild ID
const GUILD_ID = '123456789012345678';

(async () => {
  try {
    console.log('🔄 Deploying commands to test guild...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('✅ Commands deployed to test server.');
  } catch (error) {
    console.error('❌ Deployment failed:', error);
  }
})();
