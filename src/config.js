require("dotenv").config();

module.exports = {
  TOXIC_LEVEL: 3,
  MAX_REPLY_PER_KEY: 10,
  MIN_LEARN_LENGTH: 3,
  MAX_LEARN_LENGTH: 100,
  RANDOM_TROLL_RATE: 0.25,
  AUTO_REPLY: true,
  CHANNEL_ID: process.env.CHANNEL_ID
};