// commands/rpg/ping.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    console.log(`🏓 /ping triggered by ${interaction.user.tag}`);
    await interaction.reply('🏓 Pong!');
  },
};
