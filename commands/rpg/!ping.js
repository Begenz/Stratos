client.on('messageCreate', message => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Basic command check
  if (message.content === '!ping') {
    console.log(`🏓 !ping triggered by ${message.author.tag}`);
    message.reply('🏓 Pong!');
  }
});
