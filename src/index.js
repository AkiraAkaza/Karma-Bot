require("dotenv").config();

const { Client } = require("discord.js-selfbot-v13");

const messageHandler = require("./src/discord/messageHandler");

const client = new Client();

client.autoReply = true;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag} 😏`);
});

client.on("messageCreate", async (message) => {
  messageHandler(client, message);
});

client.login(process.env.TOKEN);