const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('Check your cross-server inventory'),
  async execute(interaction) {
    // Placeholder logic
    await interaction.reply("🧳 Your inventory is empty... for now.");
  }
};
