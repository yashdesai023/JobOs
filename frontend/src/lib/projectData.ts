export const projects = [
    {
        slug: "vectordb-pipe",
        title: "vectorDBpipe",
        category: "Standardization & Performance",
        description: "A modular, high-performance vector database pipeline designed for scalable RAG applications. Simplifies ingestion, embedding, and retrieval workflows.",
        image: "/projects/vector.png",
        productionUrl: "https://pypi.org/project/vectorDBpipe/",
        githubUrl: "https://github.com/yashdesai023/vectorDBpipe",
        techStack: ["Python", "Pinecone", "ChromaDB", "FastAPI"],
        content: `
## Overview
VectorDBpipe is an open-source Python library that abstracts the complexities of vector database interactions. It provides a unified interface for multiple providers like Pinecone, Chroma, and Qdrant.

### Key Features
- **Modular Design**: Swap vector stores with zero code changes.
- **Batch Processing**: Optimized for high-throughput ingestion.
- **Unified Querying**: Consistent API for semantic search.

### Impact
Reduced boilerplate code by 60% across 5 production RAG applications.

### Performance Benchmark Suite
Tested on AWS T3 instances, \`vectorDBpipe\` handles high-throughput ingestion with optimized batch processing, ensuring consistent low latency even under heavy load.
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
        techStack: ["LangChain", "OpenAI", "Redis", "Next.js"],
        content: `
## Overview
This project explores the orchestration of multiple autonomous agents to solve multi-step reasoning tasks. It uses a shared memory architecture (Redis) to allow agents to collaborate.

### Architecture
1. **Planner Agent**: Decomposes user request.
2. **Executor Agents**: Specialized tools (Web Search, Calculator, Python REPL).
3. **Critic Agent**: Reviews outputs for hallucinations.

### Results
Achieved 85% success rate on complex reasoning benchmarks (GSM8K).

### Logic Diagram
\`Summarizer AI -> Analyst AI -> Drafter AI\` loop ensures continuous refinement. The Summarizer condenses input, the Analyst extracts insights, and the Drafter generates the final output, all sharing context via the defined memory layer.
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
        techStack: ["LlamaIndex", "React", "PostgreSQL", "Cohere Rerank"],
        content: `
## Overview
Built for competitive exam aspirants, this RAG system ingests thousands of pages of NCERT textbooks and provides cited answers with 95% factual accuracy.

### Technical Challenges
- **Chunking Strategy**: Semantic chunking to preserve context.
- **Hybrid Search**: Combining keyword (BM25) and vector search.
- **Reranking**: Using Cohere's rerank mode to improve top-k precision.
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
