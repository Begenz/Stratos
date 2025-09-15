require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { loadPlayer } = require("./playerManager");

// Create client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Collections
client.commands = new Collection();        // Slash commands
const messageCommands = new Collection();  // Message-based commands

// --- Load slash commands ---
const commandsPath = path.join(__dirname, "commands");
if (fs.existsSync(commandsPath)) {
  for (const category of fs.readdirSync(commandsPath)) {
    const categoryPath = path.join(commandsPath, category);
    if (!fs.lstatSync(categoryPath).isDirectory()) continue;

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

// --- Load message-based commands ---
const messagesPath = path.join(__dirname, "messages");
if (fs.existsSync(messagesPath)) {
  for (const category of fs.readdirSync(messagesPath)) {
