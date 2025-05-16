const { QdrantClient } = require("@qdrant/js-client-rest");
const { getEmbedding } = require("./embedding.js");
require("dotenv").config();

const client = new QdrantClient({
  url: process.env.QDRANT_URL, 
  apiKey: process.env.QDRANT_API_KEY || undefined,
});

const COLLECTION_NAME = "news";

const initQdrantCollection = async () => {
  const collections = await client.getCollections();
  console.log("Collections from Qdrant:", collections);
  const exists = collections.collections.find(c => c.name === COLLECTION_NAME);

  if (!exists) {
  try {
    await client.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 768,
        distance: "Cosine",
      },
    });
    console.log(`Created collection: ${COLLECTION_NAME}`);
  } catch (err) {
    console.error("Failed to create collection:", err.message);
  }
}else {
  console.log(`✅ Collection already exists: ${COLLECTION_NAME}`);
}

};


// Save an embedding into Qdrant
const upsertDocument = async (id, vector, text) => {
  const result = await client.upsert(COLLECTION_NAME, {
  points: [
    {
      id,
      vector,
      payload: { text: text },
    },
  ],
});
console.log("Upsert result:", result);
  
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
