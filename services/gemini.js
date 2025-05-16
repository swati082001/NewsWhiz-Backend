const axios = require("axios");
const { getEmbedding } = require("./embedding.js");
const { retrieveFromQdrant } = require("./qdrantService.js");
const { saveMessage, getMessages, clearSession } = require("./redisClient.js");

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";


const handleChat = async (req, res) => {
  const { sessionId, query } = req.body;

  if (!sessionId || !query) {
    return res.status(400).json({ error: "sessionId and query are required" });
  }

  try {
    // 1. Get context from Qdrant
    const contextDocs = await retrieveFromQdrant(query);

    // 2. Build prompt for Gemini
    const prompt = `
You are a helpful assistant. Use the following news snippets to answer the question.

${contextDocs.map((doc, i) => `Snippet ${i + 1}: ${doc}`).join("\n")}

Question: ${query}
Answer:
    `.trim();

   
    const geminiRes = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const reply =
      geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, no answer.";

   
    await saveMessage(sessionId, { role: "user", content: query });
    await saveMessage(sessionId, { role: "bot", content: reply });
    console.log("Retrieved context:", contextDocs);
    // 5. Return response
    res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ error: err });
  }
};

const getHistory = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const messages = await getMessages(sessionId);
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve session history" });
  }
};

const resetSession = async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId)
    return res.status(400).json({ error: "sessionId is required" });

  await clearSession(sessionId);
  res.json({ message: "Session reset" });
};

module.exports = { handleChat, getHistory, resetSession };
