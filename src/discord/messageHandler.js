const sim = require("../core/sim");
const config = require("../config");

module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (message.author.id === client.user.id) return;
  if (message.channel.id !== config.CHANNEL_ID) return;

  const content = message.content;

  sim.learnFromUser(message.author.id, content);

  if (!client.autoReply) return;

  const reply = sim.handleMessage(message.author.id, content);

  message.reply(reply).catch(() => {});
};