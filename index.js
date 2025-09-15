const { loadPlayer } = require('./playerManager');

require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Register the user
    await loadPlayer(message.author.id);

    message.channel.send(`Hi ${message.author.username}, you are now registered!`);
});

// Slash command collection
client.commands = new Collection();

// Message command collection
const messageCommands = new Collection();

// Load slash commands from /commands
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
          console.log(`✅ Loaded slash command: ${command.data.name}`);
        } else {
          console.warn(`⚠️ Skipped ${file} — missing 'data' or 'execute'`);
        }
      } catch (err) {
        console.error(`❌ Failed to load ${file}:`, err.message);
      }
    }
  }
}

// Load message-based commands from /messages
const messagesPath = path.join(__dirname, "messages");
for (const category of fs.readdirSync(messagesPath)) {
  const categoryPath = path.join(messagesPath, category);
  if (fs.lstatSync(categoryPath).isDirectory()) {
    for (const file of fs.readdirSync(categoryPath)) {
      const filePath = path.join(categoryPath, file);
      try {
        const command = require(filePath);
        if (command.name && command.execute) {
          messageCommands.set(command.name, command);
          console.log(`✅ Loaded message command: ${command.name}`);
        } else {
          console.warn(`⚠️ Skipped ${file} — missing 'name' or 'execute'`);
        }
      } catch (err) {
        console.error(`❌ Failed to load ${file}:`, err.message);
      }
    }
  }
}

// Bot ready
client.once("ready", () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
});

// Handle slash commands
client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    return interaction.reply({
      content: "❌ Command not found.",
      ephemeral: true,
    });
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error executing /${interaction.commandName}:`, error);
    await interaction.reply({
      content: "⚠️ There was an error executing that command.",
      ephemeral: true,
    });
  }
});

// Handle message-based commands
client.on("messageCreate", message => {
  if (message.author.bot || !message.content.startsWith("!")) return;

  const commandName = message.content.slice(1).split(" ")[0];
  const command = messageCommands.get(commandName);

  if (command) {
    try {
      command.execute(message);
    } catch (error) {
      console.error(`❌ Error executing !${commandName}:`, error);
      message.reply("⚠️ There was an error executing that command.");
    }
  }
});

// Login
client.login(process.env.DISCORD_TOKEN).catch(err => {
  console.error("❌ Login failed:", err.message);
});
