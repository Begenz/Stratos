const { loadPlayer, savePlayer } = require("../../playerManager");

module.exports = {
  name: "balance",
  description: "Check your coin and bank balance",
  async execute(message) {
    try {
      const player = await loadPlayer(message.author.id);

      // Example: display balances
      const coins = player.coins || 0;
      const bank = player.bank || 0;

      message.channel.send(
        `${message.author.username}, you have 💰 ${coins} coins and 🏦 ${bank} in your bank.`
      );

      // Optional: you could modify balances here and save
      // e.g., give player 10 coins just for checking:
      // player.coins += 10;
      // await savePlayer(message.author.id, player);

    } catch (err) {
      console.error("Error fetching balance:", err);
      message.channel.send("⚠️ Could not fetch your balance.");
    }
  },
};
