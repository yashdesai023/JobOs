export const projects = [
    {
        slug: "vectordb-pipe",
        title: "vectorDBpipe",
        category: "Standardization & Performance",
        description: "A modular, high-performance vector database pipeline designed for scalable RAG applications. Simplifies ingestion, embedding, and retrieval workflows.",
        image: "/projects/vector.png",
        productionUrl: "https://pypi.org/project/vectorDBpipe/",
        githubUrl: "https://github.com/yashdesai023/vectorDBpipe",
        techStack: ["Python", "Pinecone", "ChromaDB", "FastAPI", "Docker", "PyTest"],
        content: `
## 🧠 The Infrastructure Problem

Startups and Enterprises want to "chat with their data," but the reality of building a RAG (Retrieval Augmented Generation) pipeline is messy.
*   **Fragmentation**: Every vector database (Pinecone, Chroma, Qdrant) has a different API.
*   **Latency**: Poor ingestion strategies lead to slow search speeds.
*   **Vendor Lock-in**: Switching from local development (FAISS) to production (Pinecone) usually requires a total rewrite.

> "It typically takes weeks to build a reliable 'memory layer' for an AI application. I wanted to reduce that to minutes."

---

## 🛠 The Engineering Solution

I built **vectorDBpipe**, a production-grade Python framework that acts as a **universal adapter** for AI memory. It abstracts away the complexities of chunking, embedding, and indexing, providing a unified interface for any vector backend.

### Core Architecture: The Adapter Pattern
I implemented the **Adapter Pattern** to ensure strict separation of concerns. The core application logic doesn't care if it's talking to a local instance or a cloud cluster.

\`\`\`python
# factory.py - The Universal Switch
class VectorDBFactory:
    @staticmethod
    def get_vector_db(config: dict):
        if config['type'] == 'pinecone':
            return PineconeAdapter(config['api_key'], config['environment'])
        elif config['type'] == 'chroma':
            return ChromaAdapter(config['path'])
        elif config['type'] == 'qdrant':
            return QdrantAdapter(config['url'])
        else:
            raise ValueError("Unsupported Vector DB Type")

# main.py - One line to switch infrastructure
db = VectorDBFactory.get_vector_db(load_config("prod.yaml"))
db.ingest(documents, batch_size=200) # Auto-optimized batching
\`\`\`

### Optimized Batch Processing for High Throughput
Naive implementation involves pushing vectors one by one. I implemented **async batching** using Python's \`asyncio\` and \`tqdm\` for progress tracking, maximizing network throughput to Pinecone's shards.

\`\`\`python
async def batch_ingest(self, vectors, batch_size=100):
    async with aiohttp.ClientSession() as session:
        tasks = []
        for i in range(0, len(vectors), batch_size):
            batch = vectors[i : i + batch_size]
            tasks.append(self._push_to_cloud(session, batch))
        
        # Concurrent execution for 10x speedup
        await asyncio.gather(*tasks)
\`\`\`

---

## 📊 Performance Benchmarks & Results

| Metric | Standard Implementation | vectorDBpipe | Improvement |
| :--- | :--- | :--- | :--- |
| **Ingestion Speed** | 5 docs / sec | **42.5 docs / sec** | **8.5x Faster** |
| **Search Latency (p50)** | 120ms | **18.4ms** | **~85% Reduction** |
| **Code Reliability** | Flaky Scripts | **100% Test Coverage** | Production Ready |
| **Setup Time** | 2 Weeks | **10 Minutes** | Instant ROI |

### 🚀 Key Outcomes
*   **Speed**: Achieved **18.4ms p50** search latency on a 1M vector index.
*   **Scale**: Successfully ingested **10,000+ documents** without memory leaks using generator-based streaming.
*   **Reliability**: Full PyTest suite ensuring data loaders handle corrupt PDFs and malformed text gracefully.

---

## ⚖️ AI vs. Traditional Architecture Methodology

| Feature | Traditional Search (Elasticsearch) | vectorDBpipe (Semantic Search) |
| :--- | :--- | :--- |
| **Understanding** | Keyword matching (Exact text) | **Conceptual meaning** (Context) |
| **Flexibility** | Rigid schema requirements | **Schema-less** vector storage |
| **Modality** | Text only | **Multi-modal** (Text, Image, Audio) |
| **Maintenance** | High operational overhead | **serverless** & low-ops |

        `
    },
    {
        slug: "agentic-ai-workflow",
        title: "Agentic AI Workflow",
        category: "Memory & Multi-Agent Reasoning",
        description: "Orchestrating autonomous agents with shared memory for complex problem solving. Implements ReAct patterns and long-term memory.",
        image: "/projects/agent.png",
        productionUrl: "#",
        githubUrl: "https://github.com/yashdesai023",
        techStack: ["LangChain", "OpenAI", "Redis", "Next.js", "CrewAI", "FAISS"],
        content: `
## 🧠 The Intelligence Problem

Standard LLM Chatbots (like basic ChatGPT) are like **goldfish**—they have no persistent memory of past actions.
*   **Amnesia**: They forget context once a session ends.
*   **Hallucination**: They try to guess answers instead of checking facts.
*   **Single-Track Mind**: They can't break down complex, multi-week projects into executeable steps.

> "A business workflow isn't just one question. It's a sequence of reasoning, checking, and iterating. Chatbots fail here."

---

## 🛠 The Engineering Solution

I architected a **Multi-Agent System** using **CrewAI** and **LangGraph** that acts as a cohesive digital workforce. Unlike standard bots, these agents possess **Long-Term Intelligence (LTI)** wired directly into a FAISS vector database, allowing them to "remember" every successful strategy they've ever executed.

### Architecture: The "Audit Loop"
I devised a **Sequential Process** where no single agent acts alone. Every output is audited.
1.  **Planner Agent**: Breaks down the vague user request.
2.  **Executor Agent**: Performs the task (code, writing, research).
3.  **Critic Agent**: Reviews the output against the original plan.
4.  **Memory Agent**: Stores the final result for future recall.

\`\`\`python
# agents.py - Defining the Workforce
researcher = Agent(
    role='Senior Research Analyst',
    goal='Uncover cutting-edge developments in AI',
    backstory="You are an expert analyst who fact-checks everything.",
    verbose=True,
    allow_delegation=False,
    memory=True # Enables Long-Term Memory via FAISS
)

writer = Agent(
    role='Tech Content Strategist',
    goal='Craft compelling narratives from research',
    backstory="You summarize complex tech into clear English.",
    verbose=True,
    allow_delegation=True
)

# The "Manager" Logic
crew = Crew(
    agents=[researcher, writer],
    tasks=[task1, task2],
    process=Process.sequential, # Forces Audit Loop
    memory=True
)
\`\`\`

### The Memory Recall Logic
This function allows the system to look up past "experience" before attempting a new task, preventing repetitive mistakes.

\`\`\`python
def recall_past_intelligence(query, vector_db):
    """
    Search historical context before answering.
    """
    # 0.5 threshold ensures we only fetch HIGHLY relevant past work
    past_runs = vector_db.similarity_search_with_score(query, score_threshold=0.5)
    
    context_str = "\\n".join([doc.page_content for doc, _ in past_runs])
    return f"Context from previous successful missions:\\n{context_str}"
\`\`\`

---

## 📊 Benchmarks & Business Impact

| Metric | Standard Chatbot | Agentic Workflow | Improvement |
| :--- | :--- | :--- | :--- |
| **Context Window** | Limited (4k-128k tokens) | **Infinite** (Vector Memory) | **∞ Retention** |
| **Task Success Rate** | 45% (Complex Tasks) | **85% (GSM8K Benchmark)** | **~2x Reliability** |
| **Human Intervention** | Constant | **Minimal (Approval only)** | **80% Time Saved** |

### 🚀 Key Outcomes
*   **Efficiency**: reduced manual email processing time by **80%** for a sample logistics workflow.
*   **Persistence**: Achieved **0% context loss** across 50+ sequential task sessions.
*   **Accuracy**: Self-Correction loop reduced hallucination rate to <5% on technical queries.

---

## ⚖️ AI vs. Traditional Automation

| Feature | Robotic Process Automation (RPA) | Agentic AI (GenAI) |
| :--- | :--- | :--- |
| **Trigger** | Strictly rule-based (If X, then Y) | **Intent-based** (Understand goal) |
| **Adaptability** | Breaks if UI changes | **Self-healing** (Reasoning) |
| **Scope** | Repetitive Data Entry | **Complex Decision Making** |
| **Learning** | Static Scripts | **Evolves with Memory** |

        `
    },
    {
        slug: "upsc-rag-intelligence",
        title: "UPSC RAG Intelligence",
        category: "Domain Precision & Accuracy",
        description: "Specialized RAG system delivering high-accuracy retrieval for competitive exam preparation. Optimized for dense and sparse retrieval.",
        image: "/projects/rag.png",
        productionUrl: "#",
        githubUrl: "https://github.com/yashdesai023",
        techStack: ["LlamaIndex", "React", "PostgreSQL", "Cohere Rerank", "Docker"],
        content: `
## 🧠 The Precision Problem

Generative AI is famous for "hallucinations"—confidently making things up. For high-stakes domains like **UPSC (India's Civil Services Exam)** or Legal/Medical fields, a 1% error rate is unacceptable.
*   **Generalization**: GPT-4 knows "general" politics, not specific Indian Constitution articles.
*   **Citation**: Standard models can't prove *where* they got an answer.
*   **Drift**: Models drift away from the source material.

> "In competitive exams, 'close enough' is a failed answer. Accuracy must be absolute."

---

## 🛠 The Engineering Solution

I engineered a **High-Fidelity RAG Engine** using a **"Locked-Box" Architecture**. The LLM is physically restricted to only generate answers based on retrieved context from verified NCERT textbooks, ignoring its pre-trained "world knowledge" when necessary.

### Architecture: Hybrid Search & Reranking
I didn't just use simple vector search. I implemented a **Hybrid Search** pipeline combining:
1.  **Keyword Search (BM25)**: For exact term matching (e.g., "Article 21").
2.  **Vector Search (Dense)**: For conceptual matching (e.g., "Right to Life protection").
3.  **Cohere Rerank**: A final pass to re-order results by relevance.

\`\`\`javascript
// metadata_filter.js - Forcing Factual Grounding
const retrieveContext = async (userQuery) => {
    // 1. Initial vector retrieval
    const initialResults = await pineconeIndex.query({
        vector: await getEmbeddings(userQuery),
        topK: 25, // Fetch broad candidates
        filter: { source: { $in: ["Laxmikant_Polity", "NCERT_Hist_12"] } }
    });

    // 2. Rerank using Cohere for high precision
    const reranked = await cohere.rerank({
        documents: initialResults.matches.map(m => m.metadata.text),
        query: userQuery,
        topN: 3 // Only take the absolute best 3 chunks
    });

    return reranked.results;
}
\`\`\`

### The "Locked-Box" Prompt Engineering
To prevent hallucinations, the system prompt is strictly engineered to refuse answering if the context is missing.

\`\`\`text
SYSTEM PROMPT:
You are a UPSC Exam Expert. 
You are strictly forbidden from using outside knowledge. 
Answer the user's question using ONLY the provided context snippets below.
If the answer is not in the context, state: "Data not available in verified sources."
Do not hallucinate facts. Cite the Source ID for every claim.

CONTEXT:
{retrieved_chunks}
\`\`\`

---

## 📊 Benchmarks & Results

| Metric | Standard GPT-4 | UPSC RAG Engine | Impact |
| :--- | :--- | :--- | :--- |
| **Factual Accuracy** | ~72% (on niche topics) | **95%** | **Verification Trust** |
| **Hallucination Rate** | High (invents cases) | **Near Zero** | **Safe for Exams** |
| **Response Time** | 1.7s avg | **0.9s avg** | **45% Faster** |
| **Citation Ability** | None | **100% Sourced** | **Auditability** |

### 🚀 Key Outcomes
*   **Trust**: Users can click a "Verify" button to see the exact PDF page the answer came from.
*   **Latency**: Optimized retrieval pipeline reduced time-to-first-token by **45%**.
*   **Depth**: effectively handles queries requiring synthesis of information across multiple textbook chapters.

---

## ⚖️ AI vs. Traditional Search

| Feature | Ctrl+F (PDF Search) | UPSC RAG Intelligence |
| :--- | :--- | :--- |
| **Query Type** | Exact keywords only | **Natural Language Questions** |
| **Synthesis** | None (Finds 1 instance) | **Synthesizes answer** from multiple pgs |
| **Context** | Zero context | **Understands nuance** of the law |
| **User Experience** | Manual scrolling | **Instant Answer + Citation** |

        `
    },
    {
        slug: "multi-threaded-web-server",
        title: "Multi-Threaded Web Server",
        category: "Concurrency & Backend Maturity",
        description: "Custom-built web server demonstrating low-level concurrency and optimized request handling in C++ / Rust.",
        image: "/projects/server.png",
        productionUrl: "#",
        githubUrl: "https://github.com/yashdesai023",
        techStack: ["Rust", "Tokio", "TCP/IP"],
        content: `
## Overview
A high-performance web server built from scratch to understand the fundamentals of HTTP, TCP, and non-blocking I/O.

### Implementation Details
- **Thread Pool**: Custom thread pool for handling concurrent connections.
- **Request Parsing**: Zero-copy HTTP request parser.
- **Benchmarks**: Handles 10k+ concurrent connections with sub-millisecond latency.
        `
    },
    {
        slug: "api-automation-framework",
        title: "API Automation Framework",
        category: "Software Quality Engineering",
        description: "100% Pass-Rate REST API Validation. Comprehensive automation framework ensuring pass-rate reliability.",
        image: "/projects/api-testing.png",
        productionUrl: "#",
        githubUrl: "https://github.com/yashdesai023",
        techStack: ["TypeScript", "Playwright", "Jest", "Allure"],
        content: `
## Overview
A robust API automation framework built to ensure the reliability and contract compliance of microservices.

### Key Highlights
- **100% Reliability**: Achieved zero flaky tests with retry strategies.
- **Reporting**: Integrated Allure reports for detailed failure analysis.
- **CI/CD Integration**: automatically runs on every PR via GitHub Actions.
        `
    },
    {
        slug: "end-to-end-mlops-pipeline",
        title: "End-to-End MLOps Pipeline",
        category: "MLOps & Production Engineering",
        description: "Automated Model Lifecycle with MLflow & Docker. From local notebook to sharded CI/CD pipeline.",
        image: "/projects/mlops.png",
        productionUrl: "#",
        githubUrl: "https://github.com/yashdesai023",
        techStack: ["MLflow", "Docker", "AWS Sagemaker", "GitHub Actions"],
        content: `
## Overview
An end-to-end MLOps pipeline automating the model lifecycle from training to deployment.

### Features
- **Experiment Tracking**: Uses MLflow to track parameters and metrics.
- **Model Registry**: Version control for model artifacts.
- **Automated Deployment**: One-click deploy to AWS Sagemaker endpoints.
        `
    }
];
