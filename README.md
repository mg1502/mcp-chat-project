# mcp-chat-project
MCP Chat Project is an end-to-end conversational AI platform that lets teams spin up production-grade chat assistants quickly, then plug them into any product or workflow.

Goal- Deliver fast, context-aware conversations that feel natural and solve real world problems.
Tech Stack- 
Backend: FastAPI · LangChain (LLM orchestration) · PostgreSQL · Redis
Frontend- Next.js · React · Tailwind · Chakra UI
Messaging- WebSocket + Server Sent Events for low-latency streaming
ML- OpenAI / Ollama-compatible adapters, custom fine-tuned models, Whisper ASR, AWS Polly TTS
Core Features	- Multi-channel (web, Slack, WhatsApp)
- Retrieval Augmented Generation (RAG) with vector stores
- Voice in / voice out
- Session memory and user profiles
- Admin dashboard with analytics and feedback loop
Target Users- Product teams that need rapid Q&A bots, campus help desks, healthcare triage flows, and hobby projects that want an LLM back end without the heavy lifting.

1 · Why it exists
Chatbots usually hit one of two walls: they are either too shallow (scripted flows) or too heavy (complex infra). MCP Chat Project fills the middle lane — opinionated defaults, but every layer is hackable.

2 · High-level architecture
lua
Copy
Edit
Client (Next.js)  <——WebSocket——>  Gateway (FastAPI)
                                     |         
                        +------------+-------------+
                        |                          |
                  RAG Service                LLM Service
                (vector store,              (OpenAI, local
                 doc loaders)               GGUF models)
                        |                          |
                PostgreSQL + Redis            Task Queue
Events stream from the gateway to the UI so tokens appear as soon as the model generates them.

A lightweight plugin system lets you inject custom tools — SQL queries, Python snippets, GraphQL calls — straight into the prompt chain.

# Setup in three steps
 
git clone https://github.com/your-org/mcp-chat-project
cd mcp-chat-project
docker compose up --build
The stack boots with demo endpoints, an in-memory vector store, and a playground UI at localhost:3000.
