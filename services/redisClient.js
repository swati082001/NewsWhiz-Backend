const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.connect();

const saveMessage = async (sessionId, message) => {
  await client.rPush(sessionId, JSON.stringify(message));
};

const getMessages = async (sessionId) => {
  const messages = await client.lRange(sessionId, 0, -1);
  return messages.map(msg => JSON.parse(msg));
};

const clearSession = async (sessionId) => {
  await client.del(sessionId);
};

module.exports = {
  saveMessage,
  getMessages,
  clearSession,
};
