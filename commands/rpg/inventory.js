const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('Displays your inventory'),
  async execute(interaction) {
    await interaction.reply('🧰 Your inventory is empty—for now.');
  },
};
