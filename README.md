
# 🧠 NewsWhiz Backend

This is the **backend service** for the RAG-powered chatbot built for Verifast's full-stack developer assignment. It performs:

- 📰 News ingestion and embedding using RSS feeds
- 🧠 Embedding via Jina AI
- 🔍 Vector storage and search via Qdrant Cloud
- 💬 LLM response generation via Gemini API
- 💾 Session-based chat history with Redis

---

## 🛠 Tech Stack

- **Node.js (Express)**
- **Qdrant Cloud** (vector database)
- **Jina AI** (embeddings)
- **Google Gemini API** (LLM response)
- **Redis (Upstash)** for session storage

---

## ⚙️ Setup Instructions

### 1. Clone and install dependencies

```bash
git clone https://github.com/your-username/newswhiz-backend.git
cd newswhiz-backend
npm install
```

### 2. Add environment variables

Create a `.env` file:

```env
PORT=3000
REDIS_URL=your_redis_url
GEMINI_API_KEY=your_gemini_api_key
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
JINA_API_KEY=your_jina_api_key
```

### 3. Ingest News Data (Run Once)

```bash
node scripts/ingestNews.js
```

This fetches 50 articles across multiple RSS feeds, embeds them, and stores them in Qdrant Cloud.

### 4. Run the backend

```bash
npm start
```

Backend should run on:

```
http://localhost:3000
```

---

## 🔌 API Endpoints

### POST `/api/chat`

```json
{{
  "sessionId": "abc123",
  "query": "What’s the latest in America?"
}}
```

### GET `/api/history/:sessionId`

Fetch previous messages.

### POST `/api/reset`

Clear session history.

---

## 🧠 RAG Flow

1. Retrieve top 5 similar articles from Qdrant
2. Build prompt from them
3. Send to Gemini API
4. Store response and query in Redis

---

## 📦 Deployment

Deployed on Render  
Live: `https://newswhiz-backend.onrender.com`

---

