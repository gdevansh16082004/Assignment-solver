# Academic Assistant AI Agent

An intelligent agent prototype that automates solving university-level assignments from a document.

---

## 📖 Project Overview

This project is a full-stack application that serves as an "Academic Assistant Agent." A user can upload an assignment file (in PDF or DOCX format), and the AI agent will:
1.  **Reason** about the document's content to identify all the questions.
2.  **Plan** a solution for each question by retrieving relevant context from the document itself (using a RAG pipeline).
3.  **Execute** the plan by generating detailed, step-by-step answers.
4.  **Format** the final output into a clean, readable PDF with correctly rendered mathematical notation.

The entire process is handled asynchronously to provide a smooth, non-blocking user experience, with the agent's progress visualized in real-time on the frontend.

---

## ✨ Key Features

* **Automated Question Answering:** Automates the manual task of solving academic assignments.
* **RAG (Retrieval-Augmented Generation):** The agent uses the assignment document as its own knowledge base to provide context-aware answers.
* **Asynchronous Job Processing:** Uses a BullMQ queue to handle long-running AI tasks, ensuring the UI is always responsive.
* **Agent Plan Monitoring:** The user interface features a stepper that visualizes the agent's multi-step plan in real-time.
* **High-Quality PDF Generation:** Creates clean, well-formatted PDF documents with support for raw LaTeX for mathematical formulas.

---

## 🛠️ Technology Stack

| Component | Technology | Reason |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, TypeScript, Tailwind CSS | Modern, fast, and type-safe UI development. |
| **Backend API** | Node.js, Express, TypeScript | Efficient, scalable, and allows for a unified language across the stack. |
| **AI Orchestration**| LangChain | Simplifies complex AI workflows, agents, and RAG pipelines. |
| **LLMs** | Gemini & Mistral | State-of-the-art models for generation and embeddings. |
| **Job Queue** | BullMQ + Redis | For robust, asynchronous background processing. |
| **Vector DB** | Qdrant | High-performance vector database for the RAG pipeline. |
| **PDF Generation**| PDFKit | For creating the final, formatted answer documents. |

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Docker Desktop

### 1. Clone the Repository
```bash
git clone [https://github.com/gdevansh16082004/Assignment-solver.git](https://github.com/gdevansh16082004/Assignment-solver.git)
cd Assignment-solver
```

### 2. Backend Setup
```bash
cd backend

# Create the environment file
cp .env.example .env 
# ‼️ IMPORTANT: Add your API keys to the .env file

# Install dependencies
npm install

# Start the required databases with Docker
docker run --name agent-redis -p 6379:6379 -d redis
docker run --name agent-qdrant -p 6333:6333 -d qdrant/qdrant
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Running the Application
You will need **three separate terminals** running simultaneously.

* **Terminal 1 (Backend API):**
    ```bash
    cd backend
    npm run dev:server
    ```

* **Terminal 2 (Backend Worker):**
    ```bash
    cd backend
    npm run dev:worker
    ```

* **Terminal 3 (Frontend):**
    ```bash
    cd frontend
    npm run dev
    ```
The application will now be available at `http://localhost:5173` (or another port specified by Vite).

---

## 📄 API Endpoints

* `POST /api/solve-assignment`: Submits an assignment file for processing. Returns a `jobId`.
* `GET /api/status/:jobId`: Polls for the status of a background job.
* `GET /api/download/:fileName`: Downloads the final solved PDF.

---
