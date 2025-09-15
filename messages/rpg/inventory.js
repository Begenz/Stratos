// messages/rpg/inventory.js

module.exports = {
  name: 'inventory',
  description: 'Displays your RPG inventory.',
  execute(message) {
    if (message.author.bot) return;

    const mockInventory = {
      gold: 120,
      items: ['🗡️ Iron Sword', '🧪 Health Potion', '📜 Scroll of Wisdom'],
    };

    const inventoryText = `
🎒 **${message.author.username}'s Inventory**
• Gold: ${mockInventory.gold}
• Items:
${mockInventory.items.map(item => `  • ${item}`).join('\n')}
    `;

    message.reply(inventoryText);
  },
};
