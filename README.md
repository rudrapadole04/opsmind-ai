# OpsMind AI – Week 1 (Knowledge Ingestion Layer)

This repository contains the Week-1 implementation of OpsMind AI, focusing on document ingestion and semantic search.

## 🚀 Features

- PDF upload using Multer
- Text extraction and chunking
- Local transformer-based embeddings (no paid APIs)
- MongoDB storage
- Semantic search using cosine similarity

## 🧱 Tech Stack

- Node.js
- Express.js
- MongoDB (Atlas)
- @xenova/transformers
- pdf-parse

## 📁 Folder Structure

src/
├── controllers/
├── routes/
├── services/
├── models/
└── app.js

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

````bash
git clone https://github.com/your-username/opsmind-ai.git

cd opsmind-ai

npm install

cp .env.example .env

npm start

##Server runs on:

http://localhost:3000

##🧪 API Testing (Postman)
##Upload PDF

POST /upload


Form-data:

file: PDF

##Search
POST /search


Body:

{
  "query": "company policy"
}


---

## ✅ 5. INITIALIZE GIT (IF NOT DONE)

In project root:

```bash
git init
git add .
git commit -m "Week 1: Knowledge Ingestion Layer completed"
````

## Week 3 Update

- Integrated Groq (llama) for low-latency responses
- Implemented SSE-based real-time streaming
- Added React UI with citation reference cards
