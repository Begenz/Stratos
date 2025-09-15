// messages/rpg/ping.js

module.exports = {
  name: 'ping',
  description: 'Replies with Pong!',
  execute(message) {
    if (message.author.bot) return;
    message.reply('🏓 Pong!');
  },
};
