require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// 🔍 Load all commands from nested folders in /commands
const commandFolders = fs.readdirSync("./commands");
for (const folder of commandFolders) {
  const folderPath = path.join("./commands", folder);
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(path.join(folderPath, file));
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
    }
  }
}

client.once("ready", () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error executing /${interaction.commandName}:`, error);
    await interaction.reply({ content: "There was an error executing that command.", ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);
