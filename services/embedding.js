const axios = require("axios");

const getEmbedding = async (text) => {
  const res = await axios.post("https://api.jina.ai/v1/embeddings", {
    input: [text],
    model: "jina-embeddings-v2-base-en",
  }, {
    headers: {
      "Authorization": `Bearer ${process.env.JINA_API_KEY}`,
      "Content-Type": "application/json",
    }
  });

  return res.data.data[0].embedding;
};

module.exports = { getEmbedding };
