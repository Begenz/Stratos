require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.commands = new Collection();

// Dynamically load all command files
const commandsPath = path.join(__dirname, "commands");
for (const category of fs.readdirSync(commandsPath)) {
  const categoryPath = path.join(commandsPath, category);
  if (fs.lstatSync(categoryPath).isDirectory()) {
    for (const file of fs.readdirSync(categoryPath)) {
      const filePath = path.join(categoryPath, file);
      try {
        const command = require(filePath);
        if (command.data && command.execute) {
          client.commands.set(command.data.name, command);
          console.log(`✅ Loaded command: ${command.data.name}`);
        } else {
          console.warn(`⚠️ Skipped ${file} — missing 'data' or 'execute'`);
        }
      } catch (err) {
        console.error(`❌ Failed to load ${file}:`, err.message);
      }
    }
  }
}

client.once("ready", () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    return interaction.reply({ content: "❌ Command not found.", ephemeral: true });
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error executing ${interaction.commandName}:`, error);
    await interaction.reply({ content: "⚠️ There was an error executing that command.", ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN).catch(err => {
  console.error("❌ Login failed:", err.message);
});
