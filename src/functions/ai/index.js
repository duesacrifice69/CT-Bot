const OpenAI = require("openai");
const fetch = require("node-fetch");

module.exports = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  basePath: "https://api.convoai.tech/v1",
  dangerouslyAllowBrowser: true,
  fetch,
  timeout: 300000,
});
