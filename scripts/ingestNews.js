const Parser = require("rss-parser");
const { getEmbedding } = require("../services/embedding.js");
const { initQdrantCollection, upsertDocument } = require("../services/qdrantService.js");
require("dotenv").config();

const parser = new Parser();


const RSS_FEED_URLS = [
  "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
  "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
  "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
  "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml",
  "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
  "https://www.technologyreview.com/feed/",
  "https://www.theverge.com/rss/index.xml",
  "https://www.wired.com/feed/rss",
  "https://www.cnbc.com/id/100003114/device/rss/rss.html",
  "https://feeds.bbci.co.uk/news/world/rss.xml"
];


async function fetchArticles(limit = 50) {
  let allItems = [];

  for (const url of RSS_FEED_URLS) {
    try {
      const feed = await parser.parseURL(url);
      allItems = allItems.concat(feed.items);
    } catch (err) {
      console.warn(`Could not parse: ${url} - ${err.message}`);
    }
  }

  
  const seen = new Set();
  const uniqueItems = [];

  for (const item of allItems) {
    if (!seen.has(item.title)) {
      seen.add(item.title);
      uniqueItems.push(item);
    }
    if (uniqueItems.length >= limit) break;
  }

  return uniqueItems.map((item, index) => ({
    id: index + 1,
    title: item.title,
    content: item.contentSnippet || item.content || item.summary || item.title,
  }));
}

async function embedAndStore(articles) {

  console.log("Calling initQdrantCollection...");
  await initQdrantCollection();

  for (const article of articles) {
    try {
      const embedding = await getEmbedding(article.content);
      await upsertDocument(article.id, embedding, article.content);
    } catch (err) {
      console.warn(`Failed to embed/store: ${article.title} - ${err.message}`);
    }
  }
  
}

async function run() {
  try {
    const articles = await fetchArticles();
    console.log(`Fetched ${articles.length} unique articles...`);
    await embedAndStore(articles);
    console.log("Done ingesting news articles.");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
