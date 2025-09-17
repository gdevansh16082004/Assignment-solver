import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { RetrievalQAChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MistralAIEmbeddings } from "@langchain/mistralai";

const llm = new ChatGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY, model: "gemini-1.5-flash-latest" });

// generating embeddings
const embeddings = new MistralAIEmbeddings({
    apiKey : process.env.MISTRAL_API_KEY,
    model: "mistral-embed"
})

const qdrantClient = new QdrantClient({ url: "http://localhost:6333" });

/**
 * Creates a RAG chain from a document.
 * It loads, splits, and embeds the document into a Qdrant vector store,
 * then returns a queryable chain.
 */
export async function createRagChain(filePath: string) {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
    const splitDocs = await splitter.splitDocuments(docs);
    
    const collectionName = `assignment-${Date.now()}`;
    const vectorStore = await QdrantVectorStore.fromDocuments(splitDocs, embeddings, {
        client: qdrantClient,
        collectionName: collectionName,
    });

    const retriever = vectorStore.asRetriever();
    
    // This chain will retrieve context and then use the LLM to answer
    return RetrievalQAChain.fromLLM(llm, retriever);
}