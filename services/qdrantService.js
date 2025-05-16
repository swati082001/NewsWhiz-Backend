const { QdrantClient } = require("@qdrant/js-client-rest");
const { getEmbedding } = require("./embedding.js");

const client = new QdrantClient({
  url: process.env.QDRANT_URL, 
  apiKey: process.env.QDRANT_API_KEY || undefined,
});

const COLLECTION_NAME = "news";

// Optional: Call this once at startup
const initQdrantCollection = async () => {
  const collections = await client.getCollections();
  const exists = collections.collections.find(c => c.name === COLLECTION_NAME);

  if (!exists) {
    await client.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 768, // This must match your embedding vector size
        distance: "Cosine",
      },
    });
    console.log("Qdrant collection created:", COLLECTION_NAME);
  }
};

// Save an embedding into Qdrant
const upsertDocument = async (id, vector, text) => {
  await client.upsert(COLLECTION_NAME, {
    points: [
      {
        id,
        vector,
        payload: { text },
      },
    ],
  });
};

// Retrieve top-k similar text chunks
const retrieveFromQdrant = async (query) => {
  const vector = await getEmbedding(query);

  const searchResult = await client.search(COLLECTION_NAME, {
    vector,
    limit: 5,
  });

  return searchResult.map(result => result.payload.text);
};

module.exports = {
  initQdrantCollection,
  upsertDocument,
  retrieveFromQdrant,
};
